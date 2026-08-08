"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout as logoutAction } from "@/app/actions/auth";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initial: string;
  role: string;
  isCreator: boolean;
  slug?: string;
};

interface AuthCtx {
  user: AuthUser | null;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, logout: () => {} });

export function AuthProvider({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(user);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function logout() {
    setCurrentUser(null);
    startTransition(async () => {
      await logoutAction();
      router.push("/");
    });
  }

  return (
    <Ctx.Provider value={{ user: currentUser, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
