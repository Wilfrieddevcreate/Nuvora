import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth-screen";
import { SignupForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Créez un compte Nuvora pour enregistrer vos recherches, suivre vos produits favoris et préparer votre espace créateur.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://nuvora.app/inscription" },
};

const OAUTH_ERRORS: Record<string, string> = {
  oauth_invalid: "Le flux OAuth est invalide ou a expiré. Réessayez.",
  oauth_failed: "Impossible de contacter Google. Réessayez.",
  oauth_no_email: "Google n'a pas partagé votre adresse e-mail.",
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const oauthError = params.error ? (OAUTH_ERRORS[params.error] ?? undefined) : undefined;

  return (
    <AuthScreen
      title="Créer un compte."
      description="Un accès simple pour sauvegarder vos recherches et vos favoris."
      footerLabel="Vous avez déjà un compte ?"
      footerHref="/connexion"
      footerLink="Se connecter"
      brandTitle="Rejoignez la découverte des produits digitaux."
      brandPoints={[
        "Sauvegardez vos coups de cœur",
        "Suivez les créateurs que vous aimez",
        "Référencez vos propres produits",
      ]}
    >
      <SignupForm oauthError={oauthError} />
    </AuthScreen>
  );
}
