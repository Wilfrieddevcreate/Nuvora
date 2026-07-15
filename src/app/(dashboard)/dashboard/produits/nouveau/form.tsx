"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, PLATFORMS } from "@/data/products";

const SUB_CATEGORIES: Record<string, string[]> = {
  Formation: ["IA", "Dev", "Design", "Marketing", "Business", "Finance", "Autre"],
  Ebook: ["IA", "Business", "Finance", "Marketing", "Productivité", "Autre"],
  Template: ["Notion", "Figma", "Framer", "Excel", "Autre"],
  Logiciel: ["SaaS", "Plugin", "Extension", "Autre"],
};

const PLATFORM_DOMAINS: Record<string, string> = {
  "chariow.com": "Chariow",
  "gumroad.com": "Gumroad",
  "systeme.io": "Systeme.io",
  "podia.com": "Podia",
};

function detectPlatform(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const [domain, name] of Object.entries(PLATFORM_DOMAINS)) {
      if (host === domain || host.endsWith("." + domain)) return name;
    }
  } catch {
    // URL invalide
  }
  return "";
}

const STEPS = [
  { num: 1, label: "Informations" },
  { num: 2, label: "Prix & langue" },
  { num: 3, label: "Plateforme" },
];

const TIPS: Record<number, { title: string; items: string[] }> = {
  1: {
    title: "Conseils pour bien démarrer",
    items: [
      "Un titre clair et précis génère 2× plus de clics.",
      "Décrivez le résultat concret que l'acheteur va obtenir.",
      "Choisissez des tags que les acheteurs utiliseraient pour vous trouver.",
    ],
  },
  2: {
    title: "Comment fixer votre prix ?",
    items: [
      "Les formations se vendent bien entre 29 € et 97 €.",
      "Les ebooks entre 9 € et 29 €.",
      "Un prix gratuit augmente la visibilité mais réduit la perception de valeur.",
    ],
  },
  3: {
    title: "Votre lien d'achat",
    items: [
      "Copiez l'URL exacte de la page produit sur votre plateforme.",
      "Testez le lien avant de soumettre — les acheteurs y seront redirigés directement.",
      "Nuvora ne prend aucune commission sur vos ventes.",
    ],
  },
};

const inputCls =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft";
const inputErrCls =
  "w-full rounded-xl border border-danger bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-danger focus:ring-4 focus:ring-danger/20";
const selectCls =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent-soft";
const selectErrCls =
  "w-full rounded-xl border border-danger bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-colors focus:border-danger focus:ring-4 focus:ring-danger/20";

function Label({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="text-sm font-semibold text-fg">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </span>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-medium text-danger">{msg}</p>;
}

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

export function NewProductForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");

  const [platform, setPlatform] = useState("");
  const [purchaseUrl, setPurchaseUrl] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  function clearErr(field: string) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  }

  function addTag(value: string) {
    const clean = value.trim().toLowerCase().replace(/\s+/g, "-");
    if (clean && !tags.includes(clean) && tags.length < 6) setTags((t) => [...t, clean]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((t) => t.filter((x) => x !== tag));
  }

  function handleTagKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) setTags((t) => t.slice(0, -1));
  }

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!title.trim()) errs.title = "Le titre est requis.";
      if (!description.trim()) errs.description = "La description est requise.";
      if (!category) errs.category = "Choisissez une catégorie.";
      if (!subCategory) errs.subCategory = "Choisissez une sous-catégorie.";
    }
    if (s === 2) {
      if (!isFree && !price) errs.price = "Entrez un prix ou cochez « Gratuit ».";
      if (!language) errs.language = "Choisissez une langue.";
    }
    if (s === 3) {
      if (!purchaseUrl.trim()) errs.purchaseUrl = "L'URL d'achat est requise.";
      if (!platform) errs.platform = "Choisissez une plateforme.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() { if (validateStep(step)) setStep((s) => s + 1); }
  function back() { setErrors({}); setStep((s) => s - 1); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validateStep(3)) setSubmitted(true);
  }

  function resetForm() {
    setSubmitted(false); setStep(1);
    setTitle(""); setDescription(""); setCategory(""); setSubCategory(""); setTags([]);
    setIsFree(false); setPrice(""); setLanguage(""); setCountry("");
    setPlatform(""); setPurchaseUrl(""); setErrors({});
  }

  const ic = (f: string) => (errors[f] ? inputErrCls : inputCls);
  const sc = (f: string) => (errors[f] ? selectErrCls : selectCls);

  // ── Succès ────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-xl rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-xl font-extrabold">Produit soumis avec succès !</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-fg-2">
          Notre équipe va examiner votre fiche dans les prochaines 24 à 72 h.{" "}
          Vous recevrez une notification dès qu&apos;elle sera en ligne.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.push("/dashboard/produits")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
          >
            Voir mes produits
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
          >
            Ajouter un autre produit
          </button>
        </div>
      </div>
    );
  }

  const tip = TIPS[step];

  // ── Wizard ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stepper pleine largeur */}
      <div className="rounded-2xl border border-border bg-surface px-6 py-5 shadow-soft">
        <Stepper current={step} />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

        {/* Colonne gauche : formulaire */}
        <div className="min-w-0 flex-1 space-y-5">
      {/* ── Étape 1 ── */}
      {step === 1 && (
        <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="border-b border-border pb-4">
            <h2 className="font-bold text-fg">Informations principales</h2>
            <p className="mt-0.5 text-xs text-muted">Ce que verront les acheteurs en premier.</p>
          </div>

          <div>
            <Label label="Titre du produit" required hint="Soyez précis et descriptif." />
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); clearErr("title"); }}
              maxLength={80}
              placeholder="ex. Maîtriser Claude & les agents IA"
              className={ic("title")}
            />
            <FieldError msg={errors.title} />
          </div>

          <div>
            <Label label="Description" required hint="Pour qui c'est fait et ce que l'acheteur va obtenir." />
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); clearErr("description"); }}
              rows={4}
              maxLength={600}
              placeholder="ex. Une formation complète pour concevoir des agents IA fiables avec Claude…"
              className={`${ic("description")} resize-none`}
            />
            <FieldError msg={errors.description} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label label="Catégorie" required />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setSubCategory(""); clearErr("category"); }}
                className={sc("category")}
              >
                <option value="">Choisir…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <FieldError msg={errors.category} />
            </div>
            <div>
              <Label label="Sous-catégorie" required />
              <select
                value={subCategory}
                onChange={(e) => { setSubCategory(e.target.value); clearErr("subCategory"); }}
                disabled={!category}
                className={sc("subCategory")}
              >
                <option value="">Choisir…</option>
                {(SUB_CATEGORIES[category] ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <FieldError msg={errors.subCategory} />
            </div>
          </div>

          <div>
            <Label label="Tags" hint="Jusqu'à 6 tags — Entrée ou virgule pour ajouter." />
            <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 transition-colors focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} aria-label={`Supprimer ${tag}`} className="hover:text-accent-hover">
                    <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </span>
              ))}
              {tags.length < 6 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder={tags.length === 0 ? "ia, formation, débutant…" : ""}
                  className="min-w-20 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Étape 2 ── */}
      {step === 2 && (
        <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="border-b border-border pb-4">
            <h2 className="font-bold text-fg">Prix & langue</h2>
            <p className="mt-0.5 text-xs text-muted">Ces informations aident les acheteurs à filtrer.</p>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 select-none hover:bg-surface-2 transition-colors">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => { setIsFree(e.target.checked); if (e.target.checked) { setPrice("0"); clearErr("price"); } }}
              className="size-4 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-sm font-semibold text-fg">Ce produit est gratuit</span>
          </label>

          {!isFree && (
            <div>
              <Label label="Prix" required />
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  step={0.01}
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); clearErr("price"); }}
                  placeholder="29"
                  className={`${ic("price")} pr-14`}
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-muted">EUR</span>
              </div>
              <FieldError msg={errors.price} />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label label="Langue du produit" required />
              <select value={language} onChange={(e) => { setLanguage(e.target.value); clearErr("language"); }} className={sc("language")}>
                <option value="">Choisir…</option>
                <option value="Français">Français</option>
                <option value="Anglais">Anglais</option>
              </select>
              <FieldError msg={errors.language} />
            </div>
            <div>
              <Label label="Pays du créateur" />
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="France" className={inputCls} />
            </div>
          </div>
        </div>
      )}

      {/* ── Étape 3 ── */}
      {step === 3 && (
        <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="border-b border-border pb-4">
            <h2 className="font-bold text-fg">Plateforme de vente</h2>
            <p className="mt-0.5 text-xs text-muted">Nuvora redirigera les acheteurs vers votre lien.</p>
          </div>

          <div>
            <Label label="Lien d'achat" required hint="Collez l'URL — la plateforme sera détectée automatiquement." />
            <input
              type="url"
              value={purchaseUrl}
              onChange={(e) => {
                const url = e.target.value;
                setPurchaseUrl(url);
                clearErr("purchaseUrl");
                const detected = detectPlatform(url);
                if (detected) { setPlatform(detected); clearErr("platform"); }
              }}
              placeholder="https://gumroad.com/l/mon-produit"
              className={ic("purchaseUrl")}
            />
            <FieldError msg={errors.purchaseUrl} />
          </div>

          <div>
            <Label label="Plateforme" required />
            {platform ? (
              <div className="flex items-center justify-between rounded-xl border border-accent bg-accent-soft px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="size-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  <span className="text-sm font-semibold text-accent">{platform} détecté</span>
                </div>
                <button type="button" onClick={() => setPlatform("")} className="text-xs text-muted hover:text-fg transition-colors">
                  Changer
                </button>
              </div>
            ) : (
              <>
                <select value={platform} onChange={(e) => { setPlatform(e.target.value); clearErr("platform"); }} className={sc("platform")}>
                  <option value="">Choisir manuellement…</option>
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <FieldError msg={errors.platform} />
              </>
            )}
          </div>

          <p className="text-xs text-muted">
            Nuvora ne traite aucun paiement — l&apos;achat se fait entièrement sur votre plateforme.
          </p>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between gap-4 pt-1">
        {step > 1 ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            Précédent
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface"
          >
            Annuler
          </button>
        )}

        {step < STEPS.length ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
          >
            Continuer
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            Soumettre pour validation
          </button>
        )}
      </div>
        </div>{/* fin colonne gauche */}

        {/* Colonne droite : conseils contextuels */}
        <aside className="hidden lg:block lg:w-72 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5 shadow-soft space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
              </span>
              <p className="text-sm font-bold text-fg">{tip.title}</p>
            </div>
            <ul className="space-y-3">
              {tip.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
                  <p className="text-[13px] leading-relaxed text-fg-2">{item}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4">
              <p className="text-[11px] text-muted">
                Étape {step} sur {STEPS.length}
              </p>
            </div>
          </div>
        </aside>

      </div>{/* fin flex row */}
    </form>
  );
}
