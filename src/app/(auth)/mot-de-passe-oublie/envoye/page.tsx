import type { Metadata } from "next";
import Link from "next/link";
import { LogoBadge } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Email envoyé",
  description: "Un lien de réinitialisation a été envoyé à votre adresse email.",
  robots: { index: false, follow: false },
};

export default function ResetSentPage() {
  return (
    <div className="flex min-h-dvh flex-col px-5 py-6 sm:px-8">
      <Link
        href="/connexion"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
        Retour à la connexion
      </Link>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex justify-center">
            <LogoBadge className="size-12" />
          </div>

          {/* icône enveloppe */}
          <div className="mx-auto mt-8 grid size-16 place-items-center rounded-2xl bg-accent-soft text-accent">
            <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Vérifiez votre boîte mail
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-fg-2">
            Si un compte est associé à cette adresse, vous recevrez un lien pour
            réinitialiser votre mot de passe. Pensez à vérifier vos spams.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href="/mot-de-passe-oublie/nouveau" size="lg" className="w-full">
              Simuler le clic sur le lien
            </ButtonLink>
            <ButtonLink href="/connexion" variant="secondary" size="lg" className="w-full">
              Revenir à la connexion
            </ButtonLink>
          </div>

          <p className="mt-6 text-sm text-fg-2">
            Vous n’avez rien reçu ?{" "}
            <Link
              href="/mot-de-passe-oublie"
              className="font-semibold text-accent hover:text-accent-hover"
            >
              Renvoyer le lien
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
