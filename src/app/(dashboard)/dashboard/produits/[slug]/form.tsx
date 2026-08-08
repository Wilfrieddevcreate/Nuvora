"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, PLATFORMS } from "@/data/products";
import { updateProduct, deleteProduct } from "@/app/actions/products";

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
  } catch { /* URL invalide */ }
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
      "Testez le lien avant de soumettre.",
      "Nuvora ne prend aucune commission sur vos ventes.",
    ],
  },
};

const inputCls = "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-smooth placeholder:text-fg-2 focus:border-accent focus:ring-4 focus:ring-accent-soft focus:bg-bg hover:border-border-2";
const inputErrCls = "w-full rounded-xl border border-danger bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-smooth placeholder:text-fg-2 focus:border-danger focus:ring-4 focus:ring-danger/20 hover:border-danger/50";
const selectCls = "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-smooth focus:border-accent focus:ring-4 focus:ring-accent-soft hover:border-border-2";
const selectErrCls = "w-full rounded-xl border border-danger bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-smooth focus:border-danger focus:ring-4 focus:ring-danger/20 hover:border-danger/50";

function Label({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="text-sm font-semibold text-fg">
        {label}{required && <span className="ml-1 text-danger">*</span>}
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
              <div className={`grid size-8 place-items-center rounded-full text-sm font-bold transition-all ${done ? "bg-accent text-accent-fg" : active ? "border-2 border-accent text-accent" : "border-2 border-border text-muted"}`}>
                {done ? <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg> : step.num}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${active ? "text-fg" : done ? "text-accent" : "text-muted"}`}>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && <div className={`mb-5 h-px flex-1 mx-3 transition-colors ${done ? "bg-accent" : "bg-border"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

type Props = {
  productId: string;
  initialSlug: string;
  initialTitle: string;
  initialDescription: string;
  initialCategory: string;
  initialSubCategory: string;
  initialTags: string[];
  initialPrice: number;
  initialIsFree: boolean;
  initialLanguage: string;
  initialCountry: string;
  initialPlatform: string;
  initialPurchaseUrl: string;
};

export function EditProductForm({
  productId,
  initialSlug,
  initialTitle,
  initialDescription,
  initialCategory,
  initialSubCategory,
  initialTags,
  initialPrice,
  initialIsFree,
  initialLanguage,
  initialCountry,
  initialPlatform,
  initialPurchaseUrl,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [subCategory, setSubCategory] = useState(initialSubCategory);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");

  const [isFree, setIsFree] = useState(initialIsFree);
  const [price, setPrice] = useState(initialPrice === 0 ? "" : String(initialPrice));
  const [language, setLanguage] = useState(initialLanguage);
  const [country, setCountry] = useState(initialCountry);

  const [platform, setPlatform] = useState(initialPlatform);
  const [purchaseUrl, setPurchaseUrl] = useState(initialPurchaseUrl);

  const [errors, setErrors] = useState<Record<string, string>>({});

  function clearErr(field: string) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  }

  function addTag(value: string) {
    const clean = value.trim().toLowerCase().replace(/\s+/g, "-");
    if (clean && !tags.includes(clean) && tags.length < 6) setTags((t) => [...t, clean]);
    setTagInput("");
  }

  function removeTag(tag: string) { setTags((t) => t.filter((x) => x !== tag)); }

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
    if (!validateStep(3)) return;
    setServerError(null);
    startTransition(async () => {
      const result = await updateProduct(productId, {
        title,
        description,
        category,
        subCategory,
        tags,
        price: isFree ? 0 : parseFloat(price) || 0,
        isFree,
        language,
        country,
        platform,
        purchaseUrl,
      });
      if (result?.error) setServerError(result.error);
      else setSubmitted(true);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteProduct(productId);
    });
  }

  const ic = (f: string) => (errors[f] ? inputErrCls : inputCls);
  const sc = (f: string) => (errors[f] ? selectErrCls : selectCls);
  const tip = TIPS[step];

  if (submitted) {
    return (
      <div className="max-w-xl rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h2 className="text-xl font-extrabold">Modifications soumises !</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-fg-2">
          Notre équipe va examiner vos modifications sous 8 à 12 h.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => router.push("/dashboard/produits")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-smooth hover:bg-accent-hover hover:shadow-soft-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            Voir mes produits
          </button>
          <button type="button" onClick={() => router.push(`/produit/${initialSlug}`)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-fg transition-smooth hover:bg-surface-2 hover:border-border-2 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            Voir la fiche publique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface px-6 py-5 shadow-soft">
        <Stepper current={step} />
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-5">

          {step === 1 && (
            <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="border-b border-border pb-4">
                <h2 className="font-bold text-fg">Informations principales</h2>
                <p className="mt-0.5 text-xs text-muted">Ce que verront les acheteurs en premier.</p>
              </div>
              <div>
                <Label label="Titre du produit" required hint="Soyez précis et descriptif." />
                <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); clearErr("title"); }} maxLength={80} placeholder="ex. Maîtriser Claude & les agents IA" className={ic("title")} />
                <FieldError msg={errors.title} />
              </div>
              <div>
                <Label label="Description" required hint="Pour qui c'est fait et ce que l'acheteur va obtenir." />
                <textarea value={description} onChange={(e) => { setDescription(e.target.value); clearErr("description"); }} rows={4} maxLength={600} placeholder="ex. Une formation complète pour concevoir des agents IA…" className={`${ic("description")} resize-none`} />
                <FieldError msg={errors.description} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label label="Catégorie" required />
                  <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); clearErr("category"); }} className={sc("category")}>
                    <option value="">Choisir…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <FieldError msg={errors.category} />
                </div>
                <div>
                  <Label label="Sous-catégorie" required />
                  <select value={subCategory} onChange={(e) => { setSubCategory(e.target.value); clearErr("subCategory"); }} disabled={!category} className={sc("subCategory")}>
                    <option value="">Choisir…</option>
                    {(SUB_CATEGORIES[category] ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <FieldError msg={errors.subCategory} />
                </div>
              </div>
              <div>
                <Label label="Tags" hint="Jusqu'à 6 tags. Entrée ou virgule pour ajouter." />
                <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 transition-colors focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} aria-label={`Supprimer ${tag}`} className="transition-smooth hover:text-accent-hover active:scale-75">
                        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                  {tags.length < 6 && (
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKey} onBlur={() => tagInput && addTag(tagInput)} placeholder={tags.length === 0 ? "ia, formation, débutant…" : ""} className="min-w-20 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-2" />
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="border-b border-border pb-4">
                <h2 className="font-bold text-fg">Prix & langue</h2>
                <p className="mt-0.5 text-xs text-muted">Ces informations aident les acheteurs à filtrer.</p>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 select-none hover:bg-surface-2 transition-colors">
                <input type="checkbox" checked={isFree} onChange={(e) => { setIsFree(e.target.checked); if (e.target.checked) { setPrice("0"); clearErr("price"); } }} className="size-4 rounded border-border text-accent focus:ring-accent" />
                <span className="text-sm font-semibold text-fg">Ce produit est gratuit</span>
              </label>
              {!isFree && (
                <div>
                  <Label label="Prix" required />
                  <div className="relative">
                    <input type="number" min={1} step={0.01} value={price} onChange={(e) => { setPrice(e.target.value); clearErr("price"); }} placeholder="29" className={`${ic("price")} pr-14`} />
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

          {step === 3 && (
            <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="border-b border-border pb-4">
                <h2 className="font-bold text-fg">Plateforme de vente</h2>
                <p className="mt-0.5 text-xs text-muted">Nuvora redirigera les acheteurs vers votre lien.</p>
              </div>
              <div>
                <Label label="Lien d'achat" required hint="Collez l'URL : la plateforme sera détectée automatiquement." />
                <input type="url" value={purchaseUrl} onChange={(e) => { const url = e.target.value; setPurchaseUrl(url); clearErr("purchaseUrl"); const d = detectPlatform(url); if (d) { setPlatform(d); clearErr("platform"); } }} placeholder="https://gumroad.com/l/mon-produit" className={ic("purchaseUrl")} />
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
                    <button type="button" onClick={() => setPlatform("")} className="text-xs text-muted hover:text-fg transition-smooth active:scale-90">Changer</button>
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
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-1">
            {step > 1 ? (
              <button type="button" onClick={back} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-smooth hover:bg-surface hover:border-border-2 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                Précédent
              </button>
            ) : (
              <button type="button" onClick={() => router.push("/dashboard/produits")} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-smooth hover:bg-surface hover:border-border-2 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Annuler
              </button>
            )}
            {step < STEPS.length ? (
              <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-smooth hover:bg-accent-hover hover:shadow-soft-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Continuer
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            ) : (
              <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-smooth hover:bg-accent-hover hover:shadow-soft-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                {pending ? "Enregistrement…" : "Enregistrer les modifications"}
              </button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-xl bg-accent-soft text-accent">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
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
              <div className="border-t border-border pt-3">
                <p className="text-[11px] text-muted">Étape {step} sur {STEPS.length}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft space-y-3">
              <p className="text-sm font-bold text-fg">Zone de danger</p>
              {!showDeleteConfirm ? (
                <button type="button" onClick={() => setShowDeleteConfirm(true)} className="w-full rounded-xl border border-danger/30 px-4 py-2.5 text-sm font-semibold text-danger transition-smooth hover:bg-danger/5 hover:border-danger/50 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger">
                  Supprimer ce produit
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-fg-2">Cette action est irréversible. Confirmer ?</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleDelete} disabled={pending} className="flex-1 rounded-xl bg-danger px-3 py-2 text-xs font-semibold text-white transition-smooth hover:bg-danger/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger">
                      {pending ? "…" : "Oui, supprimer"}
                    </button>
                    <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-fg transition-smooth hover:bg-surface-2 hover:border-border-2 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
