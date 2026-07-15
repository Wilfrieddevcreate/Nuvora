import Link from "next/link";
import type { SVGProps } from "react";

/**
 * Symbole Nuvora — « Nova » : un éclat d'étoile à 4 branches.
 * SVG vectoriel, se recolore via `currentColor`. Le petit centre est
 * évidé (couleur du fond) pour donner du relief.
 */
export function NovaMark({
  bg = "currentColor",
  ...props
}: SVGProps<SVGSVGElement> & { bg?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <path
        d="M24 3 L28.5 19.5 L45 24 L28.5 28.5 L24 45 L19.5 28.5 L3 24 L19.5 19.5 Z"
        fill="currentColor"
      />
      <circle cx="24" cy="24" r="3.4" fill={bg} />
    </svg>
  );
}

/**
 * Pastille du logo : le symbole Nova blanc sur fond indigo, coins arrondis.
 * Utilisée dans le header, le footer, l'auth… (taille via `className`).
 */
export function LogoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg bg-accent text-accent-fg ${className}`}
    >
      {/* symbole blanc, centre = couleur du fond (accent) */}
      <NovaMark className="size-[64%]" bg="var(--accent)" />
    </span>
  );
}

/**
 * Logo complet cliquable : pastille + mot « Nuvora ».
 * `collapsedWord` permet de replier le mot (header au scroll).
 */
export function Logo({
  href = "/",
  className = "",
  badgeClass = "size-7",
  wordClass = "text-lg",
  word,
}: {
  href?: string;
  className?: string;
  badgeClass?: string;
  wordClass?: string;
  word?: React.ReactNode; // permet d'injecter un mot animé (header)
}) {
  return (
    <Link
      href={href}
      aria-label="Nuvora — accueil"
      className={`flex items-center gap-2 font-extrabold ${className}`}
    >
      <LogoBadge className={badgeClass} />
      {word ?? <span className={wordClass}>Nuvora</span>}
    </Link>
  );
}
