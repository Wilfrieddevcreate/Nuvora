import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth-screen";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à votre compte Nuvora pour retrouver vos produits sauvegardés, vos recommandations et votre espace créateur.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://nuvora.app/connexion" },
};

const OAUTH_ERRORS: Record<string, string> = {
  oauth_invalid: "Le flux OAuth est invalide ou a expiré. Réessayez.",
  oauth_failed: "Impossible de contacter Google. Réessayez.",
  oauth_no_email: "Google n'a pas partagé votre adresse e-mail.",
};

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const oauthError = params.error ? (OAUTH_ERRORS[params.error] ?? undefined) : undefined;

  return (
    <AuthScreen
      title="Bon retour."
      description="Connectez-vous pour reprendre vos favoris et vos recommandations."
      footerLabel="Pas encore de compte ?"
      footerHref="/inscription"
      footerLink="Créer un compte"
      brandTitle="Le meilleur du digital, trouvé pour vous."
      brandPoints={[
        "Vos favoris et recherches sauvegardés",
        "Des recommandations par l'assistant IA",
        "Un seul endroit pour tout découvrir",
      ]}
    >
      <LoginForm oauthError={oauthError} />
    </AuthScreen>
  );
}
