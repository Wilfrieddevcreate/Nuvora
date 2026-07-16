"use client";

import { useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/contexts/favorites";
import { useAuth } from "@/contexts/auth";
import { getProductBySlug, PRODUCTS, toDbProduct } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { Modal, ModalActions } from "@/components/modal";

const TABS = [
  { id: "favoris", label: "Mes favoris" },
  { id: "historique", label: "Historique" },
  { id: "parametres", label: "Paramètres" },
] as const;

type Tab = typeof TABS[number]["id"];

// Mock historique
const MOCK_HISTORY = PRODUCTS.slice(0, 4).map((p) => ({
  slug: p.slug,
  visitedAt: "Il y a 2 h",
}));

function EmptyState({ icon, title, desc, cta }: { icon: React.ReactNode; title: string; desc: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-surface-2 text-muted">{icon}</div>
      <p className="font-semibold text-fg">{title}</p>
      <p className="max-w-xs text-sm text-muted">{desc}</p>
      {cta}
    </div>
  );
}

export default function CompteClient() {
  const [tab, setTab] = useState<Tab>("favoris");
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const favProducts = favorites
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map(toDbProduct);

  return (
    <>
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      {/* En-tête profil */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="grid size-16 place-items-center rounded-full bg-indigo-500 text-2xl font-extrabold text-white">
          {user?.initial ?? "?"}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">{user?.name ?? ""}</h1>
          <p className="mt-0.5 text-sm text-muted">{user?.email ?? ""}</p>
        </div>
      </div>

      {/* Onglets */}
      <div role="tablist" className="mb-6 -mx-5 px-5 sm:mx-0 sm:px-0 flex gap-1 overflow-x-auto whitespace-nowrap rounded-xl border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            id={`tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-accent text-accent-fg shadow-soft"
                : "text-muted hover:text-fg"
            }`}
          >
            {t.label}
            {t.id === "favoris" && favorites.length > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${tab === "favoris" ? "bg-white/20" : "bg-accent-soft text-accent"}`}>
                {favorites.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {tab === "favoris" && (
        <div role="tabpanel" id="panel-favoris" aria-labelledby="tab-favoris">
          {favProducts.length === 0 ? (
            <EmptyState
              icon={<svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
              title="Aucun favori pour l'instant"
              desc="Cliquez sur le cœur d'un produit pour le retrouver ici."
              cta={<Link href="/catalogue" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2">Explorer le catalogue</Link>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
        </div>
      )}

      {tab === "historique" && (
        <div role="tabpanel" id="panel-historique" aria-labelledby="tab-historique">
          <div className="space-y-3">
            {MOCK_HISTORY.map(({ slug, visitedAt }) => {
              const p = getProductBySlug(slug);
              if (!p) return null;
              return (
                <Link
                  key={slug}
                  href={`/produit/${slug}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-lg font-extrabold text-accent">
                    {p.title.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-fg">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{p.category} · {p.creator}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{visitedAt}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {tab === "parametres" && (
        <div role="tabpanel" id="panel-parametres" aria-labelledby="tab-parametres">
          <div className="max-w-lg space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft space-y-5">
              <h2 className="font-bold text-fg">Informations personnelles</h2>
              <div className="space-y-4">
                {[
                  { label: "Nom complet", id: "input-nom", value: user?.name ?? "", type: "text" },
                  { label: "Email", id: "input-email", value: user?.email ?? "", type: "email" },
                ].map(({ label, id, value, type }) => (
                  <div key={label}>
                    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-fg">{label}</label>
                    <input
                      id={id}
                      type={type}
                      defaultValue={value}
                      className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
                    />
                  </div>
                ))}
              </div>
              <button type="button" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover">
                Enregistrer
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft space-y-3">
              <h2 className="font-bold text-fg">Déconnexion</h2>
              <p className="text-sm text-muted">En vous déconnectant, vous serez redirigé vers la page d'accueil.</p>
              <button
                type="button"
                onClick={() => setConfirmLogout(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-danger/40 hover:bg-danger/5 hover:text-danger"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Se déconnecter
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft space-y-3">
              <h2 className="font-bold text-fg">Zone de danger</h2>
              <p className="text-sm text-muted">La suppression de votre compte est irréversible.</p>
              <button type="button" className="rounded-xl border border-danger/30 px-4 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/5">
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    <Modal
      open={confirmLogout}
      onClose={() => setConfirmLogout(false)}
      title="Se déconnecter ?"
      size="sm"
    >
      <p className="text-[15px] text-fg-2">
        Vous allez être déconnecté de votre compte Nuvora. Vos favoris resteront sauvegardés localement.
      </p>
      <ModalActions>
        <button
          type="button"
          onClick={() => setConfirmLogout(false)}
          className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={() => { logout(); }}
          className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-85"
        >
          Se déconnecter
        </button>
      </ModalActions>
    </Modal>
    </>
  );
}
