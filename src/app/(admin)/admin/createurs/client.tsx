"use client";

import { useTransition } from "react";
import Link from "next/link";
import { verifyCreator } from "@/app/actions/admin";

type Creator = {
  id: string;
  slug: string;
  name: string;
  email: string;
  tagline: string;
  specialty: string;
  platform: string;
  verified: boolean;
  productCount: number;
  joinedYear: string;
};

const COLORS = [
  "bg-indigo-500", "bg-violet-500", "bg-rose-500", "bg-sky-500",
  "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-teal-500",
];

function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % COLORS.length;
  return COLORS[h];
}

function CreatorCard({ c }: { c: Creator }) {
  const [pending, startTransition] = useTransition();

  function handleVerify() {
    startTransition(() => verifyCreator(c.id));
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span className={`grid size-11 shrink-0 place-items-center rounded-full ${avatarColor(c.name)} text-base font-extrabold text-white`}>
          {c.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-fg">{c.name}</p>
            {c.verified && (
              <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-label="Vérifié">
                <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">{c.tagline || c.email}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-muted">
        {c.specialty && (
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
            <span>{c.specialty}</span>
          </div>
        )}
        {c.platform && (
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            <span>{c.platform}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h10" /></svg>
            {c.productCount} produit{c.productCount > 1 ? "s" : ""}
          </span>
          <span>Depuis {c.joinedYear}</span>
        </div>
      </div>

      <div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          c.verified
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
            : "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
        }`}>
          {c.verified ? (
            <>
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
              Vérifié
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              En attente
            </>
          )}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Link
          href={`/createur/${c.slug}`}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-semibold text-fg transition-colors hover:bg-surface-2"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
          Voir le profil
        </Link>
        {!c.verified && (
          <button
            type="button"
            onClick={handleVerify}
            disabled={pending}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-2 text-xs font-semibold text-white transition-smooth hover:bg-rose-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" /><path d="M9 12l2 2 4-4" /></svg>
            {pending ? "…" : "Vérifier"}
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminCreateursClient({ creators }: { creators: Creator[] }) {
  const verifiedCount = creators.filter((c) => c.verified).length;
  const unverifiedCount = creators.length - verifiedCount;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold">Créateurs</h1>
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-sm font-semibold text-muted">
              {creators.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {verifiedCount} vérifié{verifiedCount > 1 ? "s" : ""} · {unverifiedCount} non vérifié{unverifiedCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            label: "Total créateurs", value: creators.length,
            iconColor: "bg-rose-50 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400",
            icon: <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="7" r="4" /><path d="M17 11a4 4 0 0 1 0 8" /><path d="M3 21a8 8 0 0 1 12 0" /></svg>,
          },
          {
            label: "Vérifiés", value: verifiedCount,
            iconColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20",
            icon: <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" /><path d="M9 12l2 2 4-4" /></svg>,
          },
          {
            label: "Non vérifiés", value: unverifiedCount,
            iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-500/20",
            icon: <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
          },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:flex-row sm:items-center sm:gap-4">
            <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${stat.iconColor}`}>
              {stat.icon}
            </span>
            <div>
              <p className="text-xl font-extrabold leading-none">{stat.value}</p>
              <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {creators.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border py-14 text-sm text-muted">
          Aucun créateur inscrit pour l&apos;instant.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {creators.map((c) => <CreatorCard key={c.id} c={c} />)}
        </div>
      )}
    </div>
  );
}
