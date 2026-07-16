"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export type AuthState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirm?: string[];
    general?: string[];
  };
};

// Precomputed hash used when the email doesn't exist, so bcrypt.compare()
// always takes ~200ms regardless — prevents timing-based email enumeration.
const DUMMY_HASH = "$2b$12$ji2E56/kjD7tBCIOofnVwevElwQuuRywwsal0eEf88i0XfdDqxA8a";

export async function signup(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rl = await checkRateLimit("signup");
  if (!rl.ok) {
    const waitSec = Math.ceil(rl.retryAfterMs / 1000);
    return { errors: { general: [`Trop de tentatives. Réessayez dans ${waitSec} s.`] } };
  }

  const firstName = (formData.get("firstName") as string | null)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const confirm = (formData.get("confirm") as string | null) ?? "";

  const errors: AuthState["errors"] = {};

  if (!firstName || !lastName) errors.name = ["Le prénom et le nom sont obligatoires."];
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = ["Adresse e-mail invalide."];
  if (password.length < 8)
    errors.password = ["Le mot de passe doit contenir au moins 8 caractères."];
  if (password !== confirm)
    errors.confirm = ["Les mots de passe ne correspondent pas."];

  if (Object.keys(errors).length > 0) return { errors };

  const existing = await db.user.findUnique({ where: { email } });
  const hashed = await bcrypt.hash(password, 12);

  // Don't reveal whether the email was already taken — silently succeed
  // and create the session only if the insert actually happened.
  if (!existing) {
    const name = `${firstName} ${lastName}`;
    const user = await db.user.create({ data: { email, password: hashed, name } });
    await createSession({ userId: user.id, role: user.role, name: user.name });
    redirect("/onboarding");
  }

  // Email already exists — redirect without revealing it (no enumeration)
  redirect("/onboarding");
}

export async function login(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rl = await checkRateLimit("login");
  if (!rl.ok) {
    const waitSec = Math.ceil(rl.retryAfterMs / 1000);
    return { errors: { general: [`Trop de tentatives. Réessayez dans ${waitSec} s.`] } };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const errors: AuthState["errors"] = {};
  if (!email) errors.email = ["L'adresse e-mail est obligatoire."];
  if (!password) errors.password = ["Le mot de passe est obligatoire."];
  if (Object.keys(errors).length > 0) return { errors };

  const user = await db.user.findUnique({ where: { email } });
  // Always run bcrypt even when user doesn't exist — constant-time response
  const passwordMatch = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
  if (!user || !passwordMatch) {
    return { errors: { general: ["E-mail ou mot de passe incorrect."] } };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });

  if (user.role === "admin") redirect("/admin");
  if (user.role === "creator") redirect("/dashboard");
  redirect("/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/");
}
