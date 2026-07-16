"use client";

import { useState } from "react";

const INITIAL_PLATFORMS = [
  { id: "gumroad", label: "Gumroad", enabled: true },
  { id: "systemeio", label: "Systeme.io", enabled: true },
  { id: "podia", label: "Podia", enabled: true },
  { id: "chariow", label: "Chariow", enabled: true },
];

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
        checked ? "bg-rose-500" : "bg-surface-2"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className="border-b border-border px-6 py-4">
        <h2 className="font-bold text-fg">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10";

export default function AdminParametresPage() {
  // Section Plateforme
  const [platformName, setPlatformName] = useState("Nuvora");
  const [platformUrl, setPlatformUrl] = useState("https://nuvora.app");
  const [platformDesc, setPlatformDesc] = useState("");
  const [contactEmail, setContactEmail] = useState("contact@nuvora.app");
  const [savedPlatform, setSavedPlatform] = useState(false);

  // Section Modération
  const [manualValidation, setManualValidation] = useState(true);
  const [reviewModeration, setReviewModeration] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [validationDelay, setValidationDelay] = useState("48h");

  // Section Plateformes
  const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);
  const [newPlatform, setNewPlatform] = useState("");

  // Section Danger
  const [maintenance, setMaintenance] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [demoReset, setDemoReset] = useState(false);

  function handleSavePlatform(e: React.FormEvent) {
    e.preventDefault();
    setSavedPlatform(true);
    setTimeout(() => setSavedPlatform(false), 2500);
  }

  function togglePlatform(id: string) {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  }

  function addPlatform() {
    const trimmed = newPlatform.trim();
    if (!trimmed) return;
    setPlatforms((prev) => [
      ...prev,
      { id: trimmed.toLowerCase().replace(/\s+/g, "-"), label: trimmed, enabled: true },
    ]);
    setNewPlatform("");
  }

  function handleClearCache() {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  }

  function handleDemoReset() {
    setDemoReset(true);
    setTimeout(() => setDemoReset(false), 2500);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold">Paramètres</h1>
        <p className="mt-0.5 text-sm text-muted">Configuration de la plateforme Nuvora.</p>
      </div>

      {/* Section 1 — Plateforme */}
      <SectionCard
        title="Plateforme"
        description="Informations générales visibles publiquement."
      >
        <form onSubmit={handleSavePlatform} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-fg">Nom de la plateforme</span>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-fg">URL publique</span>
              <input
                type="url"
                value={platformUrl}
                onChange={(e) => setPlatformUrl(e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-fg">Description courte</span>
            <textarea
              rows={3}
              value={platformDesc}
              onChange={(e) => setPlatformDesc(e.target.value)}
              placeholder="Décrivez votre marketplace en quelques mots…"
              className={`${INPUT_CLASS} resize-none`}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-fg">Email de contact</span>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={INPUT_CLASS}
            />
          </label>

          <div className="flex items-center justify-end gap-3 pt-1">
            {savedPlatform && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                Enregistré
              </span>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-85"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Section 2 — Modération */}
      <SectionCard
        title="Modération"
        description="Contrôlez la validation des contenus soumis sur la plateforme."
      >
        <div className="space-y-5">
          {/* Toggle : validation manuelle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor="toggle-manual" className="text-sm font-semibold text-fg cursor-pointer">
                Validation manuelle des produits
              </label>
              <p className="text-xs text-muted mt-0.5">Chaque produit soumis doit être approuvé par un admin.</p>
            </div>
            <Toggle id="toggle-manual" checked={manualValidation} onChange={setManualValidation} />
          </div>

          <div className="border-t border-border" />

          {/* Toggle : modération des avis */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor="toggle-reviews" className="text-sm font-semibold text-fg cursor-pointer">
                Modération des avis avant publication
              </label>
              <p className="text-xs text-muted mt-0.5">Les avis sont soumis à validation avant d&apos;être publiés.</p>
            </div>
            <Toggle id="toggle-reviews" checked={reviewModeration} onChange={setReviewModeration} />
          </div>

          <div className="border-t border-border" />

          {/* Toggle : notifications email */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor="toggle-emails" className="text-sm font-semibold text-fg cursor-pointer">
                Notifications email à chaque soumission
              </label>
              <p className="text-xs text-muted mt-0.5">Recevez un email à chaque nouvelle soumission de produit ou d&apos;avis.</p>
            </div>
            <Toggle id="toggle-emails" checked={emailNotifs} onChange={setEmailNotifs} />
          </div>

          <div className="border-t border-border" />

          {/* Select : délai de validation */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <label htmlFor="validation-delay" className="text-sm font-semibold text-fg">Délai de validation</label>
              <p className="text-xs text-muted mt-0.5">Délai maximum attendu pour traiter une soumission.</p>
            </div>
            <select
              id="validation-delay"
              value={validationDelay}
              onChange={(e) => setValidationDelay(e.target.value)}
              className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-fg outline-none transition-colors focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10"
            >
              <option value="24h">24 heures</option>
              <option value="48h">48 heures</option>
              <option value="72h">72 heures</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Section 3 — Plateformes autorisées */}
      <SectionCard
        title="Plateformes autorisées"
        description="Gérez les plateformes de vente acceptées pour les produits listés."
      >
        <div className="space-y-3">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-2 px-4 py-3">
              <span className="text-sm font-semibold text-fg">{platform.label}</span>
              <Toggle
                id={`platform-${platform.id}`}
                checked={platform.enabled}
                onChange={() => togglePlatform(platform.id)}
              />
            </div>
          ))}

          {/* Ajouter une plateforme */}
          <div className="mt-4 flex gap-2 pt-1">
            <label htmlFor="new-platform" className="sr-only">Nom de la nouvelle plateforme</label>
            <input
              id="new-platform"
              type="text"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPlatform())}
              placeholder="Nom de la plateforme…"
              className={`${INPUT_CLASS} flex-1`}
            />
            <button
              type="button"
              onClick={addPlatform}
              disabled={!newPlatform.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Ajouter
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Section 4 — Danger */}
      <div className="rounded-2xl border border-danger/30 bg-danger/5 shadow-soft">
        <div className="border-b border-danger/20 px-6 py-4">
          <h2 className="font-bold text-danger">Zone de danger</h2>
          <p className="mt-0.5 text-sm text-fg-2">Ces actions sont sensibles et peuvent affecter l&apos;ensemble de la plateforme.</p>
        </div>
        <div className="divide-y divide-danger/10 px-6">
          {/* Vider le cache */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="text-sm font-semibold text-fg">Vider le cache</p>
              <p className="text-xs text-muted mt-0.5">Force le rechargement de toutes les données mises en cache.</p>
            </div>
            <button
              type="button"
              onClick={handleClearCache}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                cacheCleared
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/30"
              }`}
            >
              {cacheCleared ? (
                <>
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Cache vidé
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                  </svg>
                  Vider le cache
                </>
              )}
            </button>
          </div>

          {/* Mode maintenance */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="text-sm font-semibold text-fg">Mode maintenance</p>
              <p className="text-xs text-muted mt-0.5">Affiche une page de maintenance aux visiteurs pendant les travaux.</p>
            </div>
            <div className="flex items-center gap-3">
              {maintenance && (
                <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">
                  Actif
                </span>
              )}
              <button
                type="button"
                onClick={() => setMaintenance((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  maintenance
                    ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-500/30 dark:text-yellow-300 dark:hover:bg-yellow-500/40"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:hover:bg-yellow-500/30"
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                {maintenance ? "Désactiver" : "Activer"}
              </button>
            </div>
          </div>

          {/* Réinitialiser les données de démo */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="text-sm font-semibold text-fg">Réinitialiser les données de démo</p>
              <p className="text-xs text-muted mt-0.5">Restaure tous les produits, avis et créateurs fictifs à leur état initial.</p>
            </div>
            <button
              type="button"
              onClick={handleDemoReset}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                demoReset
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  : "border border-danger/40 text-danger hover:bg-danger/10"
              }`}
            >
              {demoReset ? (
                <>
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Réinitialisé
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                  </svg>
                  Réinitialiser
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
