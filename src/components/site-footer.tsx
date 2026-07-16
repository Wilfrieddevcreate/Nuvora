import Link from "next/link";
import { LogoBadge } from "@/components/logo";

const COLS = [
  {
    title: "Découvrir",
    links: [
      { href: "/catalogue", label: "Catalogue" },
      { href: "/catalogue/formation", label: "Formations" },
      { href: "/catalogue/ebook", label: "Ebooks" },
      { href: "/catalogue/template", label: "Templates" },
      { href: "/catalogue/logiciel", label: "Logiciels" },
      { href: "/assistant", label: "Assistant IA" },
    ],
  },
  {
    title: "Créateurs",
    links: [
      { href: "/createur", label: "Pourquoi Nuvora ?" },
      { href: "/tarifs", label: "Tarifs" },
      { href: "/inscription", label: "Référencer un produit" },
    ],
  },
  {
    title: "Nuvora",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgu", label: "CGU" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "mailto:contact@nuvora.app", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
              <LogoBadge className="size-7" />
              Nuvora
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Le moteur de découverte des meilleurs produits digitaux.
              On vous aide à trouver, on redirige vers l’achat.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-bold">{col.title}</div>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-fg"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Nuvora. Tous droits réservés.</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/mentions-legales" className="transition-colors hover:text-fg">Mentions légales</Link>
            <Link href="/cgu" className="transition-colors hover:text-fg">CGU</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-fg">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
