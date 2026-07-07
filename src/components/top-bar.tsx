import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/assistant", label: "Assistant" },
  { href: "/createur", label: "Créateur" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-line-strong bg-paper">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-5 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[22px] font-display"
        >
          <span className="inline-block size-2.5 rounded-full bg-accent" />
          Nu<span className="text-accent">vora</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[2px] px-3 py-2 text-[13px] font-medium uppercase tracking-[0.04em] text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/inscription"
            className="hidden h-9 items-center rounded-[2px] bg-accent px-3.5 text-[12px] font-medium uppercase tracking-[0.04em] text-white transition-colors hover:bg-ink sm:inline-flex"
          >
            S’inscrire
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
