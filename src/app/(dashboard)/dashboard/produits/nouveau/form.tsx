"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, PLATFORMS } from "@/data/products";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useToast } from "@/contexts/toast";
import { submitProduct } from "@/app/actions/products";
import { scrapeProduct } from "@/app/actions/scrape";

const SUB_CATEGORIES: Record<string, string[]> = {
  Formation: ["IA", "Dev", "Design", "Marketing", "Business", "Finance", "Autre"],
  Ebook: ["IA", "Business", "Finance", "Marketing", "Productivité", "Autre"],
  Template: ["Notion", "Figma", "Framer", "Excel", "Autre"],
  Logiciel: ["SaaS", "Plugin", "Extension", "Autre"],
};

const PLATFORM_KEYWORDS: Record<string, string> = {
  "chariow": "Chariow",
  "gumroad": "Gumroad",
  "systeme": "Systeme.io",
  "podia": "Podia",
  "lemonsqueezy": "Lemon Squeezy",
  "payhip": "Payhip",
};

function detectPlatform(url: string): string {
  try {
    const urlLower = url.toLowerCase();
    for (const [keyword, name] of Object.entries(PLATFORM_KEYWORDS)) {
      if (urlLower.includes(keyword)) return name;
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
      "Décrivez le résultat concret que le visiteur va obtenir.",
      "Choisissez des tags que vos futurs clients utiliseraient pour vous trouver.",
    ],
  },
  2: {
    title: "Comment fixer votre prix ?",
    items: [
      "Les formations sont généralement proposées entre 29 € et 97 €.",
      "Les ebooks, entre 9 € et 29 €.",
      "Un prix gratuit augmente la visibilité mais réduit la perception de valeur.",
    ],
  },
  3: {
    title: "Votre lien d'achat",
    items: [
      "Copiez l'URL exacte de la page produit sur votre plateforme.",
      "Testez le lien avant de soumettre : les visiteurs y seront redirigés directement.",
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
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-remplissage IA
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, startScraping] = useTransition();
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scraped, setScraped] = useState(false);

  function handleScrape() {
    if (!scrapeUrl.trim()) return;
    setScrapeError(null);
    setScraped(false);
    startScraping(async () => {
      const result = await scrapeProduct(scrapeUrl.trim());
      if (result.error) {
        setScrapeError(result.error);
        return;
      }
      if (result.title) setTitle(result.title);
      if (result.description) setDescription(result.description);
      if (result.category) { setCategory(result.category); setSubCategory(""); }
      if (result.subCategory) setSubCategory(result.subCategory);
      if (result.tags) setTags(result.tags);
      if (result.isFree) { setIsFree(true); setPrice("0"); }
      else if (typeof result.price === "number" && result.price > 0) setPrice(String(result.price));
      if (result.language) setLanguage(result.language);
      setScraped(true);
      toast("Champs pré-remplis par l'IA — vérifiez et ajustez !", "success");
    });
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");

  const [platform, setPlatform] = useState("");
  const [purchaseUrl, setPurchaseUrl] = useState("");

  // Image upload
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier type
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setUploadError("Format non autorisé (JPG, PNG, WebP ou GIF)");
      return;
    }

    // Vérifier taille (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Fichier trop gros (max 5MB)");
      return;
    }

    setCoverImage(file);
    setUploadError(null);

    // Aperçu
    const reader = new FileReader();
    reader.onload = (e) => setCoverImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImage() {
    if (!coverImage) return;
    setUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", coverImage);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Erreur upload");
        setUploadingImage(false);
        return;
      }

      setUploadedImagePath(data.url);
      toast("Image uploadée !", "success");
      setUploadingImage(false);
    } catch (err) {
      setUploadError("Erreur lors de l'upload");
      setUploadingImage(false);
    }
  }

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
    if (!validateStep(3)) return;
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitProduct({
        title, description, category, subCategory, tags,
        price: parseFloat(price) || 0,
        currency,
        isFree, language, country, platform, purchaseUrl,
        coverImage: uploadedImagePath,
      });
      if (result?.error) {
        setSubmitError(result.error);
      } else {
        toast("Produit soumis, en attente de validation", "success");
        setSubmitted(true);
      }
    });
  }

  function resetForm() {
    setSubmitted(false); setStep(1);
    setTitle(""); setDescription(""); setCategory(""); setSubCategory(""); setTags([]);
    setIsFree(false); setPrice(""); setLanguage(""); setCountry("");
    setPlatform(""); setPurchaseUrl(""); setErrors({});
    setCoverImage(null); setCoverImagePreview(""); setUploadedImagePath(""); setUploadError(null);
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
          Notre équipe va examiner votre fiche dans les prochaines 8 à 12 h.{" "}
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

      {/* ── Bandeau auto-remplissage IA ── */}
      <div className="rounded-2xl border border-accent/40 bg-accent-soft/60 p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a8 8 0 1 0 0 16A8 8 0 0 0 12 2z" />
              <path d="M12 8v4l3 3" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-fg">Auto-remplissage IA</p>
            <p className="mt-0.5 text-xs text-muted">Collez l'URL de votre page produit (Gumroad, Podia…) et l'IA pré-remplit les champs.</p>
            <div className="mt-3 flex gap-2">
              <input
                type="url"
                value={scrapeUrl}
                onChange={(e) => { setScrapeUrl(e.target.value); setScrapeError(null); setScraped(false); }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleScrape())}
                placeholder="https://gumroad.com/l/mon-produit"
                className="min-w-0 flex-1 rounded-xl border border-border bg-bg px-4 py-2 text-[14px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
              />
              <button
                type="button"
                onClick={handleScrape}
                disabled={scraping || !scrapeUrl.trim()}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {scraping ? (
                  <>
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><circle cx="12" cy="12" r="10" strokeOpacity={0.25} /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                    Analyse…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    Analyser
                  </>
                )}
              </button>
            </div>
            {scrapeError && <p className="mt-2 text-xs font-medium text-danger">{scrapeError}</p>}
            {scraped && !scrapeError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                Champs pré-remplis — vérifiez avant de soumettre.
              </p>
            )}
          </div>
        </div>
      </div>

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
            <p className="mt-0.5 text-xs text-muted">Ce que verront les visiteurs en premier.</p>
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
            <Label label="Description" required hint="Pour qui c'est conçu et ce que l'utilisateur en retirera." />
            <RichTextEditor
              value={description}
              onChange={(value) => { setDescription(value); clearErr("description"); }}
              placeholder="ex. Une formation complète pour concevoir des agents IA fiables avec Claude…"
            />
            <FieldError msg={errors.description} />
          </div>

          <div>
            <Label label="Couverture du produit" hint="JPG, PNG, WebP ou GIF (max 5MB)" />
            <div className="flex gap-4">
              <div className="flex-1">
                {!uploadedImagePath ? (
                  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-bg/50 px-6 py-8 transition-colors hover:border-accent hover:bg-accent-soft/30">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="text-center">
                      <svg viewBox="0 0 24 24" className="mx-auto size-6 text-muted" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15 16 10 5 21" />
                      </svg>
                      <p className="mt-2 text-sm font-medium text-fg">Cliquez pour uploader</p>
                      {coverImagePreview && (
                        <p className="mt-1 text-xs text-muted">{coverImage?.name}</p>
                      )}
                    </div>
                  </label>
                ) : (
                  <div className="rounded-xl border border-accent bg-accent-soft/30 p-4 text-center">
                    <p className="text-sm font-semibold text-accent">✓ Image uploadée</p>
                    <p className="mt-1 text-xs text-muted">{uploadedImagePath}</p>
                    <button
                      type="button"
                      onClick={() => { setUploadedImagePath(""); setCoverImagePreview(""); setCoverImage(null); }}
                      className="mt-2 text-xs font-medium text-accent hover:text-accent-hover"
                    >
                      Changer
                    </button>
                  </div>
                )}
              </div>
              {coverImagePreview && !uploadedImagePath && (
                <div className="flex flex-col items-end gap-2">
                  <img src={coverImagePreview} alt="Aperçu" className="max-h-24 rounded-lg border border-border" />
                  <button
                    type="button"
                    onClick={uploadImage}
                    disabled={uploadingImage}
                    className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-60"
                  >
                    {uploadingImage ? "Upload…" : "Valider"}
                  </button>
                </div>
              )}
            </div>
            {uploadError && <p className="mt-2 text-xs font-medium text-danger">{uploadError}</p>}
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
            <Label label="Tags" hint="Jusqu'à 6 tags. Appuyez sur Entrée ou virgule pour en ajouter." />
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
            <p className="mt-0.5 text-xs text-muted">Ces informations aident les visiteurs à filtrer.</p>
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
            <div className="space-y-3">
              <Label label="Prix" required />
              <div className="grid gap-2 sm:grid-cols-3">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-border bg-bg px-3 py-2 text-sm font-medium text-fg focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <optgroup label="Europe">
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CHF">CHF (CHF)</option>
                  </optgroup>
                  <optgroup label="Amérique">
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="MXN">MXN ($)</option>
                    <option value="BRL">BRL (R$)</option>
                  </optgroup>
                  <optgroup label="Asie-Pacifique">
                    <option value="AUD">AUD (A$)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="SGD">SGD ($)</option>
                    <option value="THB">THB (฿)</option>
                    <option value="MYR">MYR (RM)</option>
                    <option value="PHP">PHP (₱)</option>
                    <option value="IDR">IDR (Rp)</option>
                    <option value="VND">VND (₫)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="TWD">TWD (NT$)</option>
                    <option value="HKD">HKD (HK$)</option>
                  </optgroup>
                  <optgroup label="Afrique">
                    <option value="ZAR">ZAR (R)</option>
                    <option value="EGP">EGP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="KES">KES (Sh)</option>
                    <option value="GHS">GHS (₵)</option>
                    <option value="XOF">XOF (CFA Ouest)</option>
                    <option value="XAF">XAF (CFA Centre)</option>
                  </optgroup>
                </select>
                <input
                  type="number"
                  min={1}
                  step={0.01}
                  value={price}
                  onChange={(e) => { setPrice(e.target.value); clearErr("price"); }}
                  placeholder="29"
                  className={`${ic("price")} sm:col-span-2`}
                />
              </div>
              <p className="text-xs text-muted">
                {price && currency ? `${price} ${currency}` : "Entrez un prix"}
              </p>
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
            <p className="mt-0.5 text-xs text-muted">Nuvora redirigera les visiteurs intéressés vers votre lien d'achat.</p>
          </div>

          <div>
            <Label label="Lien d'achat" required hint="Collez l'URL : la plateforme sera détectée automatiquement." />
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
            Nuvora ne traite aucun paiement. L&apos;achat se fait entièrement sur votre plateforme.
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
          <div className="flex flex-col items-end gap-2">
            {submitError && (
              <p className="text-sm text-danger">{submitError}</p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? (
                "Envoi en cours…"
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Soumettre pour validation
                </>
              )}
            </button>
          </div>
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
