"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { LogoBadge } from "@/components/logo";
import { completeOnboarding } from "@/app/actions/onboarding";

const STEPS = [
  { num: 1, label: "Votre profil" },
  { num: 2, label: "Votre spécialité" },
  { num: 3, label: "Prêt !" },
];

const PLATFORMS = ["Chariow", "Gumroad", "Systeme.io", "Podia"];

const CATEGORIES: { value: string; icon: React.ReactNode; desc: string }[] = [
  {
    value: "Formation",
    desc: "Cours vidéo, webinaire, programme",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    value: "Ebook",
    desc: "Guide, livre numérique, PDF",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    value: "Template",
    desc: "Notion, Figma, Framer, Excel",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    value: "Logiciel",
    desc: "SaaS, plugin, extension",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8l2 2-2 2M13 10h4" />
      </svg>
    ),
  },
];

const inputCls =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft";
const selectCls =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent-soft";

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-between">
      {STEPS.map((step, idx) => {
        const done = step.num < current;
        const active = step.num === current;
        return (
          <li key={step.num} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`grid size-8 place-items-center rounded-full text-sm font-bold transition-all ${
                  done
                    ? "bg-accent text-accent-fg"
                    : active
                    ? "border-2 border-accent text-accent"
                    : "border-2 border-border text-muted"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${active ? "text-fg" : done ? "text-accent" : "text-muted"}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`mb-5 h-px flex-1 mx-3 transition-colors ${done ? "bg-accent" : "bg-border"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  // Étape 1
  const [displayName, setDisplayName] = useState("");
  const [tagline, setTagline] = useState("");
  const [platform, setPlatform] = useState("");

  // Étape 2
  const [category, setCategory] = useState("");

  function next() { setStep((s) => s + 1); }
  function back() { setStep((s) => s - 1); }

  function finish() {
    setServerError(null);
    startTransition(async () => {
      const result = await completeOnboarding({
        displayName,
        tagline,
        platform,
        specialty: category,
      });
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <div className="min-h-dvh bg-bg">
      <header className="flex h-16 items-center justify-between px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-extrabold">
          <LogoBadge className="size-7" />
          Nuvora
        </Link>
        <span className="text-sm text-muted">Étape {step} sur {STEPS.length}</span>
      </header>

      <main className="mx-auto max-w-lg px-5 py-12 space-y-8">
        <Stepper current={step} />

        {/* ── Étape 1 — Votre profil ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-fg">Votre profil créateur</h1>
              <p className="mt-1.5 text-sm text-muted">
                Ces informations seront visibles par les acheteurs sur vos fiches produit.
              </p>
            </div>

            <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-fg">
                  Nom d&apos;affichage
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={60}
                  placeholder="ex. Studio Lumen"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-fg">
                  Tagline
                  <span className="ml-1.5 font-normal text-muted">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  maxLength={100}
                  placeholder="ex. Formations IA pour créateurs"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-fg">
                  Plateforme principale
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Choisir…</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={next}
                disabled={!displayName.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Étape 2 — Votre spécialité ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-fg">Quel type de produits créez-vous ?</h1>
              <p className="mt-1.5 text-sm text-muted">
                Cette information nous aide à vous mettre en avant auprès des bons acheteurs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const selected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all ${
                      selected
                        ? "border-accent bg-accent-soft shadow-soft"
                        : "border-border bg-surface hover:border-accent/40 hover:bg-surface-2 shadow-soft"
                    }`}
                  >
                    <span className={`grid size-10 place-items-center rounded-xl transition-colors ${
                      selected ? "bg-accent text-accent-fg" : "bg-bg text-fg"
                    }`}>
                      {cat.icon}
                    </span>
                    <div>
                      <p className={`text-sm font-bold ${selected ? "text-accent" : "text-fg"}`}>
                        {cat.value}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{cat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Précédent
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!category}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Étape 3 — Prêt ! ── */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-surface px-8 py-12 text-center shadow-soft">
              <div className="grid size-20 place-items-center rounded-2xl bg-accent-soft text-accent">
                <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-fg">Votre compte est prêt !</h1>
                <p className="text-[15px] leading-relaxed text-fg-2">
                  Vous pouvez maintenant référencer vos premiers produits.
                  Notre équipe validera chaque fiche sous 8 à 12 h.
                </p>
              </div>

              {serverError && (
                <p role="alert" className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </p>
              )}

              <button
                type="button"
                onClick={finish}
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover disabled:opacity-60 w-full sm:w-auto"
              >
                {pending ? "Création en cours…" : "Accéder à mon espace créateur"}
                {!pending && (
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={back}
              className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Retour à l&apos;étape précédente
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
