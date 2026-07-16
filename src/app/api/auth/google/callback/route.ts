import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { google } from "@/lib/google-oauth";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

interface GoogleUserInfo {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

export async function GET(request: Request): Promise<never> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const store = await cookies();
  const storedState = store.get("google_oauth_state")?.value;
  const codeVerifier = store.get("google_code_verifier")?.value;

  // Clear one-time cookies immediately
  store.delete("google_oauth_state");
  store.delete("google_code_verifier");

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    redirect("/connexion?error=oauth_invalid");
  }

  let googleUser: GoogleUserInfo;
  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const accessToken = tokens.accessToken();

    const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("userinfo_failed");
    googleUser = (await res.json()) as GoogleUserInfo;
  } catch {
    redirect("/connexion?error=oauth_failed");
  }

  if (!googleUser.email) {
    redirect("/connexion?error=oauth_no_email");
  }

  // Find or create user — merge if same email already exists
  let user = await db.user.findFirst({
    where: {
      OR: [
        { googleId: googleUser.sub },
        { email: googleUser.email },
      ],
    },
  });

  if (user) {
    // Link Google account if signing in with matching email
    if (!user.googleId) {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.sub,
          avatar: user.avatar ?? googleUser.picture ?? null,
        },
      });
    }
  } else {
    user = await db.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.sub,
        avatar: googleUser.picture ?? null,
        password: null,
      },
    });
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });

  if (user.role === "admin") redirect("/admin");
  if (user.role === "creator") redirect("/dashboard");
  // New user or buyer — go through creator onboarding
  redirect("/onboarding");
}
