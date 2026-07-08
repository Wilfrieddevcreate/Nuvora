import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

const NAV = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/assistant", label: "Assistant IA" },
  { href: "/createur", label: "Espace créateur" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid size-7 place-items-center rounded-lg bg-accent text-accent-fg text-sm">
            N
          </span>
          Nuvora
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/connexion"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-fg-2 transition-colors hover:text-fg sm:inline-flex"
          >
            Connexion
          </Link>
          <ButtonLink href="/inscription" size="sm" className="hidden sm:inline-flex">
            S’inscrire
          </ButtonLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
