"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/contexts/toast";
import { getCreatorBySlug, getProductsByCreator } from "@/data/products";

const MOCK_CREATOR_SLUG = "studio-lumen";

export default function ProfilClient() {
  const creator = getCreatorBySlug(MOCK_CREATOR_SLUG);
  const products = getProductsByCreator(MOCK_CREATOR_SLUG);
  const { toast } = useToast();

  const [name, setName] = useState(creator?.name ?? "");
  const [specialty, setSpecialty] = useState(creator?.specialty ?? "");
  const [tagline, setTagline] = useState(creator?.tagline ?? "");
  const [bio, setBio] = useState(creator?.bio ?? "");
  const [email, setEmail] = useState("studio@lumen.co");

  if (!creator) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast("Profil mis à jour", "success");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">Mon profil</h1>
        <Link
          href={`/createur/${creator.slug}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          Voir mon profil public
        </Link>
      </div>

      {/* Carte identité */}
      <div className="max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
        <div className={`h-20 ${creator.color} opacity-20`} />
        <div className="px-6 pb-6">
          <div className="-mt-7 flex items-end gap-4">
            <span className={`grid size-14 place-items-center rounded-xl ${creator.color} text-xl font-extrabold text-white ring-4 ring-surface`}>
              {creator.name.charAt(0)}
            </span>
            <div className="mb-1">
              {creator.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Vérifié
                </span>
              )}
            </div>
          </div>
          <h2 className="mt-3 text-lg font-extrabold">{creator.name}</h2>
          <p className="text-sm text-accent">{creator.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-fg-2">{creator.bio}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
            <span className="rounded-full border border-border px-3 py-1">{creator.specialty}</span>
            <span className="rounded-full border border-border px-3 py-1">{creator.platform}</span>
            <span className="rounded-full border border-border px-3 py-1">Depuis {creator.joinedYear}</span>
            <span className="rounded-full border border-border px-3 py-1">{products.length} produit{products.length > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Formulaire édition */}
      <div className="max-w-2xl rounded-2xl border border-border bg-surface shadow-soft">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-bold">Modifier mes informations</h2>
          <p className="mt-0.5 text-sm text-muted">Ces informations apparaissent sur votre profil public.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-fg">Nom / pseudo</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-fg">Spécialité</span>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-fg">Accroche</span>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-fg">Bio</span>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-none rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-fg">Adresse e-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-[15px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
            />
          </label>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>

      {/* Zone danger */}
      <div className="max-w-2xl rounded-2xl border border-danger/30 bg-danger/5 px-6 py-5">
        <h2 className="font-bold text-danger">Zone de danger</h2>
        <p className="mt-1 text-sm text-fg-2">
          La suppression de votre compte est irréversible. Tous vos produits seront dépubliés.
        </p>
        <button
          type="button"
          className="mt-4 rounded-xl border border-danger/40 px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
