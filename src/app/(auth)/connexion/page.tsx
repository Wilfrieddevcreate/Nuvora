import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth-screen";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Connexion — Nuvora",
  description:
    "Connectez-vous à votre compte Nuvora pour retrouver vos produits sauvegardés, vos recommandations et votre espace créateur.",
};

export default function ConnexionPage() {
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
        "Des recommandations par l’assistant IA",
        "Un seul endroit pour tout découvrir",
      ]}
    >
      <LoginForm />
    </AuthScreen>
  );
}
