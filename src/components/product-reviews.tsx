"use client";

import { useState } from "react";
import { useTransition } from "react";
import { submitReview } from "@/app/actions/admin";

interface Review {
  id: number;
  author: string;
  initial: string;
  rating: number; // 1-5
  date: string;
  text: string;
  verified: boolean;
}

// Mock reviews par slug (quelques produits ont des avis)
const REVIEWS: Record<string, Review[]> = {
  "maitriser-claude-agents-ia": [
    { id: 1, author: "Sophie M.", initial: "S", rating: 5, date: "Il y a 3 j", text: "Formation incroyable, très complète et bien structurée. J'ai pu créer mon premier agent en moins d'une semaine.", verified: true },
    { id: 2, author: "Karim B.", initial: "K", rating: 5, date: "Il y a 1 sem", text: "Le meilleur contenu sur Claude que j'ai trouvé. Hautement recommandé.", verified: true },
    { id: 3, author: "Laura D.", initial: "L", rating: 4, date: "Il y a 2 sem", text: "Très bon contenu, quelques parties auraient pu être plus détaillées mais globalement excellent.", verified: false },
  ],
  "pack-prompts-marketing": [
    { id: 1, author: "Thomas R.", initial: "T", rating: 5, date: "Il y a 5 j", text: "Ces prompts m'ont fait gagner des heures chaque semaine. Indispensable.", verified: true },
    { id: 2, author: "Amina K.", initial: "A", rating: 4, date: "Il y a 2 sem", text: "Très bon pack, bien organisé. Quelques prompts sont vraiment bluffants.", verified: true },
  ],
};

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "size-5" : "size-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`${sz} ${i < rating ? "text-amber-400" : "text-border"}`} fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function ProductReviews({ slug }: { slug: string }) {
  const reviews = REVIEWS[slug] ?? [];
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");
  const [, startTransition] = useTransition();

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }));

  async function handleSubmit() {
    if (!selected || !comment.trim()) return;

    startTransition(async () => {
      try {
        await submitReview(slug, selected, comment.trim());
        setSubmitted(true);
        setShowForm(false);
        setSelected(0);
        setComment("");
        setTimeout(() => setSubmitted(false), 4000);
      } catch (error) {
        console.error("Erreur lors de la soumission de l'avis:", error);
      }
    });
  }

  if (reviews.length === 0 && !showForm) {
    return (
      <div className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-extrabold">Avis</h2>
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface py-12 text-center shadow-soft">
          <div className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-muted">
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <p className="font-semibold text-fg">Aucun avis pour l'instant</p>
          <p className="max-w-xs text-sm text-muted">Soyez le premier à donner votre avis sur ce produit.</p>
          <button type="button" onClick={() => setShowForm(true)} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover">
            Laisser un avis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold">Avis ({reviews.length})</h2>
        {!showForm && !submitted && (
          <button type="button" onClick={() => setShowForm(true)} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2">
            Laisser un avis
          </button>
        )}
      </div>

      {/* Résumé */}
      {reviews.length > 0 && (
        <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:flex-row sm:items-center">
          <div className="flex flex-col items-center gap-1 sm:w-32 sm:shrink-0">
            <span className="text-5xl font-extrabold">{avg.toFixed(1)}</span>
            <Stars rating={Math.round(avg)} size="lg" />
            <span className="text-xs text-muted">{reviews.length} avis</span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            {dist.map(({ n, count }) => (
              <div key={n} className="flex items-center gap-3">
                <span className="w-3 text-xs text-muted">{n}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }} />
                </div>
                <span className="w-4 text-xs text-muted">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire */}
      {showForm && !submitted && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h3 className="font-bold text-fg">Votre avis</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-fg">Note</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onMouseEnter={() => setHovered(i + 1)} onMouseLeave={() => setHovered(0)} onClick={() => setSelected(i + 1)} aria-label={`${i + 1} étoiles`}>
                    <svg viewBox="0 0 24 24" className={`size-7 transition-colors ${(hovered || selected) > i ? "text-amber-400" : "text-border"}`} fill="currentColor" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-fg">Commentaire</label>
              <textarea rows={4} placeholder="Partagez votre expérience avec ce produit…" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handleSubmit} disabled={!selected || !comment.trim()} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover disabled:opacity-40">
                Publier l'avis
              </button>
              <button type="button" onClick={() => { setShowForm(false); setSelected(0); setComment(""); }} className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <svg viewBox="0 0 24 24" className="size-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Merci ! Votre avis sera publié après modération.</p>
        </div>
      )}

      {/* Liste des avis */}
      {reviews.length > 0 && (
        <ul className="mt-6 space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                    {r.initial}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-fg">{r.author}</span>
                      {r.verified && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">Achat vérifié</span>}
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted">{r.date}</span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-fg-2">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
