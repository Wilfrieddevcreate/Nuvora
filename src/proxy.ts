import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "off",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// Patterns evaluated in order — most specific first
const ROUTE_RULES = [
  { pattern: /^\/admin(\/|$)/, requiredRole: "admin" as const },
  { pattern: /^\/dashboard(\/|$)/, requiredRole: "any" as const },
  // /onboarding requires a session (any role)
  { pattern: /^\/onboarding(\/|$)/, requiredRole: "any" as const },
];

const AUTH_PAGES = /^\/(connexion|inscription)(\/|$)/;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Security headers on every response
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }

  // Optimistic session check — JWT decode only, no DB hit
  const token = req.cookies.get("nuvora_session")?.value;
  const session = token ? await decrypt(token) : null;

  for (const rule of ROUTE_RULES) {
    if (!rule.pattern.test(pathname)) continue;

    // Not logged in at all
    if (!session?.userId) {
      const url = req.nextUrl.clone();
      url.pathname = "/connexion";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // Wrong role for admin routes
    if (rule.requiredRole === "admin" && session.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    break;
  }

  // Redirect already-authenticated users away from login/signup
  if (AUTH_PAGES.test(pathname) && session?.userId) {
    if (session.role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    if (session.role === "creator") return NextResponse.redirect(new URL("/dashboard", req.url));
    // buyer with session → still needs onboarding
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
