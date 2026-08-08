"use client";

import { useTransition } from "react";
import { useState } from "react";
import Link from "next/link";
import { approveReview, rejectReview } from "@/app/actions/admin";

type Review = {
  id: string;
  author: string;
  initial: string;
  rating: number;
  comment: string;
  productTitle: string;
  productSlug: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

type Tab = "pending" | "approved" | "rejected";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`size-3.5 ${i < rating ? "text-amber-400" : "text-border"}`} fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return "Hier";
  if (d < 7) return `Il y a ${d} j`;
  if (d < 30) return `Il y a ${Math.floor(d / 7)} sem`;
  return `Il y a ${Math.floor(d / 30)} mois`;
}

function ReviewCard({ review }: { review: Review }) {
  const [, startTransition] = useTransition();

  function approve() {
    startTransition(() => approveReview(review.id));
  }
  function reject() {
    startTransition(() => rejectReview(review.id));
  }

  return (
    <li className={`rounded-2xl border p-5 shadow-soft transition-colors ${
      review.status === "approved"
        ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/5"
        : review.status === "rejected"
        ? "border-danger/20 bg-danger/5"
        : "border-border bg-surface"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-100 text-sm font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            {review.initial}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-fg">{review.author}</span>
              {review.status === "approved" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Approuvé
                </span>
              )}
              {review.status === "rejected" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger">
                  <svg viewBox="0 0 24 24" className="size-2.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  Rejeté
                </span>
              )}
            </div>
            <Stars rating={review.rating} />
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted">{timeAgo(review.createdAt)}</span>
      </div>

      {review.comment && (
        <p className="mt-3 text-[14px] leading-relaxed text-fg-2">{review.comment}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/produit/${review.productSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          {review.productTitle}
        </Link>

        {review.status === "pending" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={approve}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-85"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
              Approuver
            </button>
            <button
              type="button"
              onClick={reject}
              className="inline-flex items-center gap-1.5 rounded-xl border border-danger px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              Rejeter
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export function AdminAvisClient({ reviews }: { reviews: Review[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const counts = {
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  const totalDecided = counts.approved + counts.rejected;
  const approvalRate = totalDecided > 0 ? Math.round((counts.approved / totalDecided) * 100) : 0;

  const visible = reviews.filter((r) => r.status === activeTab);

  const TABS: { id: Tab; label: string }[] = [
    { id: "pending", label: "En attente" },
    { id: "approved", label: "Approuvés" },
    { id: "rejected", label: "Rejetés" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Avis &amp; modération</h1>
          <p className="mt-0.5 text-sm text-muted">
            {counts.pending} avis en attente de modération
          </p>
        </div>
        {counts.pending > 0 && (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            {counts.pending} en attente
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">En attente</p>
          <p className="mt-1 text-3xl font-extrabold text-fg">{counts.pending}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Approuvés</p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{counts.approved}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Taux d&apos;approbation</p>
          <p className="mt-1 text-3xl font-extrabold text-fg">{approvalRate}%</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-2xl border border-border bg-surface p-1.5 shadow-soft">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-rose-500 text-white shadow-soft"
                : "text-muted hover:bg-surface-2 hover:text-fg"
            }`}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                activeTab === tab.id
                  ? "bg-white/25 text-white"
                  : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
              }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface py-16 text-center shadow-soft">
          <div className="grid size-12 place-items-center rounded-2xl bg-surface-2 text-muted">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="font-semibold text-fg">Aucun avis dans cette catégorie</p>
          <p className="text-sm text-muted">
            {activeTab === "pending" ? "Tous les avis ont été traités." : "Aucun avis ici pour l'instant."}
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {visible.map((r) => <ReviewCard key={r.id} review={r} />)}
        </ul>
      )}
    </div>
  );
}
