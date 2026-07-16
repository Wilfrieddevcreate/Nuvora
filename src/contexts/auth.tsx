"use client";

import { createContext, useContext, useState } from "react";

export type AuthUser = {
  name: string;
  email: string;
  initial: string;
  isCreator: boolean;
  slug: string;
};

interface AuthCtx {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  login: () => {},
  logout: () => {},
});

// Utilisateur mocké — simule une session active
const MOCK_USER: AuthUser = {
  name: "Wilfried H.",
  email: "wilfried@example.com",
  initial: "W",
  isCreator: false,
  slug: "wilfried-h",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Commence connecté avec le mock pour pouvoir tester l'UI
  const [user, setUser] = useState<AuthUser | null>(MOCK_USER);
  return (
    <Ctx.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
