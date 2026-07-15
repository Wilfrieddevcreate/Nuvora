import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth-flows";
import { AuthScreen } from "@/components/auth-screen";

export const metadata: Metadata = {
  title: "Mot de passe oublié — Nuvora",
  description:
    "Réinitialisez le mot de passe de votre compte Nuvora en recevant un lien par email.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthScreen
      title="Mot de passe oublié ?"
      description="Entrez votre adresse email : nous vous enverrons un lien pour réinitialiser votre mot de passe."
      footerLabel="Vous vous en souvenez ?"
      footerHref="/connexion"
      footerLink="Se connecter"
      brandTitle="On vous aide à retrouver l’accès."
      brandPoints={[
        "Un lien sécurisé envoyé par email",
        "Valable 30 minutes",
        "Aucune donnée de paiement chez nous",
      ]}
    >
      <ForgotPasswordForm />
    </AuthScreen>
  );
}
