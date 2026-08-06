"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { getCreatorVerificationData, verifyCreatorWithReason, rejectCreatorVerification } from "@/app/actions/creator-verification";
import { Modal, ModalActions } from "@/components/modal";

type Creator = {
  id: string;
  slug: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  specialty?: string;
  verified: boolean;
  productCount: number;
  createdAt: Date;
};

type VerificationData = Awaited<ReturnType<typeof getCreatorVerificationData>>;

export function CreatorVerificationClient({ creators }: { creators: Creator[] }) {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData>(null);
  const [modal, setModal] = useState<"verify" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSelectCreator = async (creator: Creator) => {
    setSelectedCreator(creator);
    startTransition(async () => {
      const data = await getCreatorVerificationData(creator.id);
      setVerificationData(data);
    });
  };

  const handleVerify = () => {
    if (!selectedCreator) return;
    startTransition(async () => {
      await verifyCreatorWithReason(selectedCreator.id, "Critères validés");
      setModal(null);
      setSelectedCreator(null);
    });
  };

  const handleReject = () => {
    if (!selectedCreator) return;
    startTransition(async () => {
      await rejectCreatorVerification(selectedCreator.id, reason);
      setModal(null);
      setReason("");
      setSelectedCreator(null);
    });
  };

  const unverifiedCreators = creators.filter((c) => !c.verified);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Certification créateurs</h1>
        <p className="mt-1 text-sm text-muted">
          {unverifiedCreators.length} créateur{unverifiedCreators.length > 1 ? "s" : ""} en attente de certification
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Liste créateurs */}
        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <h3 className="mb-3 font-semibold">Créateurs à examiner</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {unverifiedCreators.map((creator) => (
              <button
                key={creator.id}
                onClick={() => handleSelectCreator(creator)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-smooth ${
                  selectedCreator?.id === creator.id
                    ? "bg-accent text-accent-fg"
                    : "hover:bg-surface text-fg-2 hover:text-fg"
                }`}
              >
                <p className="font-medium truncate">{creator.name}</p>
                <p className="text-xs">{creator.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Détails et checklist */}
        {selectedCreator && verificationData ? (
          <div className="rounded-xl border border-border bg-surface p-4 lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-start gap-3">
                {verificationData.creator.avatar && (
                  <img
                    src={verificationData.creator.avatar}
                    alt={verificationData.creator.user.name}
                    className="size-12 rounded-full"
                  />
                )}
                <div>
                  <h2 className="font-semibold text-fg">{verificationData.creator.user.name}</h2>
                  <p className="text-xs text-muted">{verificationData.creator.user.email}</p>
                  <p className="text-xs text-muted mt-1">
                    Inscrit il y a {verificationData.criteria.daysOld} jours
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 border-t border-border pt-4">
              <h3 className="text-sm font-semibold">Critères de certification</h3>

              <div className="space-y-2">
                {/* Profil complet */}
                <div className="flex items-start gap-3 rounded-lg bg-surface-2 p-3">
                  <div className={`shrink-0 size-5 rounded border-2 flex items-center justify-center ${
                    verificationData.criteria.hasCompleteProfile
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-rose-500"
                  }`}>
                    {verificationData.criteria.hasCompleteProfile && (
                      <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg">Profil complet</p>
                    <p className="text-xs text-muted">Bio, avatar, spécialité</p>
                  </div>
                </div>

                {/* Minimum produits */}
                <div className="flex items-start gap-3 rounded-lg bg-surface-2 p-3">
                  <div className={`shrink-0 size-5 rounded border-2 flex items-center justify-center ${
                    verificationData.criteria.hasMinimumProducts
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-rose-500"
                  }`}>
                    {verificationData.criteria.hasMinimumProducts && (
                      <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg">Minimum 3 produits</p>
                    <p className="text-xs text-muted">{verificationData.criteria.productCount} produit(s)</p>
                  </div>
                </div>

                {/* Pas de rejet récent */}
                <div className="flex items-start gap-3 rounded-lg bg-surface-2 p-3">
                  <div className={`shrink-0 size-5 rounded border-2 flex items-center justify-center ${
                    verificationData.criteria.hasNoRecentRejections
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-rose-500"
                  }`}>
                    {verificationData.criteria.hasNoRecentRejections && (
                      <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg">Aucun rejet récent</p>
                    <p className="text-xs text-muted">{verificationData.criteria.rejectedCount} rejet(s)</p>
                  </div>
                </div>

                {/* Ancien depuis 2 semaines */}
                <div className="flex items-start gap-3 rounded-lg bg-surface-2 p-3">
                  <div className={`shrink-0 size-5 rounded border-2 flex items-center justify-center ${
                    verificationData.criteria.isOldEnough
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-rose-500"
                  }`}>
                    {verificationData.criteria.isOldEnough && (
                      <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg">Inscrit depuis 14+ jours</p>
                    <p className="text-xs text-muted">{verificationData.criteria.daysOld} jours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Produits */}
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold mb-2">Produits ({verificationData.products.length})</h3>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {verificationData.products.slice(0, 5).map((p) => (
                  <div key={p.id} className="text-xs text-fg-2 truncate">
                    {p.title}
                    <span className={`ml-2 font-medium ${
                      p.status === "active" ? "text-emerald-500" : p.status === "pending" ? "text-amber-500" : "text-rose-500"
                    }`}>
                      ({p.status})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-border pt-4">
              <button
                onClick={() => setModal("verify")}
                disabled={isPending}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ✓ Certifier
              </button>
              <button
                onClick={() => setModal("reject")}
                disabled={isPending}
                className="flex-1 rounded-lg border border-rose-500 px-4 py-2 text-sm font-semibold text-rose-500 transition-smooth hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ✕ Refuser
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface-2 p-4 lg:col-span-2 flex items-center justify-center min-h-96 text-muted">
            Sélectionne un créateur pour voir les détails
          </div>
        )}
      </div>

      {/* Modal Certification */}
      <Modal
        open={modal === "verify"}
        onClose={() => setModal(null)}
        title="Confirmer la certification"
        size="sm"
      >
        <p className="text-[15px] text-fg-2">
          {selectedCreator?.name} sera marqué comme créateur certifié et recevra une notification.
        </p>
        <ModalActions>
          <button
            type="button"
            onClick={() => setModal(null)}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-smooth hover:bg-surface-2"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={isPending}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Certifier
          </button>
        </ModalActions>
      </Modal>

      {/* Modal Rejection */}
      <Modal
        open={modal === "reject"}
        onClose={() => setModal(null)}
        title="Refuser la certification"
        size="sm"
      >
        <div className="space-y-3">
          <p className="text-[15px] text-fg-2">
            Motif du rejet :
          </p>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none"
          >
            <option value="">— Sélectionne un motif —</option>
            <option value="profile-incomplete">Profil incomplet</option>
            <option value="insufficient-products">Produits insuffisants</option>
            <option value="recent-rejections">Rejets récents</option>
            <option value="too-new">Compte trop récent</option>
            <option value="quality-issues">Problèmes de qualité</option>
            <option value="spam">Contenu suspect</option>
          </select>
        </div>
        <ModalActions>
          <button
            type="button"
            onClick={() => setModal(null)}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-smooth hover:bg-surface-2"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={isPending || !reason}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Refuser
          </button>
        </ModalActions>
      </Modal>
    </div>
  );
}
