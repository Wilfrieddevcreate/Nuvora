import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation de Nuvora — droits et obligations des utilisateurs et créateurs.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://nuvora.app/cgu" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-fg">{title}</h2>
      <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-fg-2">{children}</div>
    </section>
  );
}

export default function CguPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-medium text-accent">Juridique</p>
        <h1 className="mt-2 text-3xl font-extrabold">
          Conditions générales d&apos;utilisation
        </h1>
        <p className="mt-3 text-fg-2">
          En accédant et en utilisant le site Nuvora, vous acceptez sans réserve les
          présentes conditions générales d&apos;utilisation. Veuillez les lire attentivement.
        </p>
      </div>

      <Section title="1. Présentation du service">
        <p>
          Nuvora est un moteur de découverte de produits digitaux. Le service permet
          aux utilisateurs de rechercher, parcourir et être redirigés vers des produits
          (ebooks, formations, templates, logiciels) créés et vendus par des créateurs
          indépendants sur leurs propres plateformes.
        </p>
        <p>
          <strong className="text-fg">Nuvora n&apos;est pas un vendeur.</strong> Aucune
          transaction financière n&apos;est réalisée sur Nuvora. L&apos;achat se fait
          exclusivement sur la plateforme du créateur concerné.
        </p>
      </Section>

      <Section title="2. Accès au service">
        <p>
          L&apos;accès au catalogue et à l&apos;assistant IA est libre et gratuit, sans
          création de compte obligatoire.
        </p>
        <p>
          La création d&apos;un compte permet de sauvegarder des produits et d&apos;accéder
          à l&apos;espace créateur pour soumettre des produits. L&apos;utilisateur s&apos;engage à
          fournir des informations exactes lors de l&apos;inscription et à maintenir la
          confidentialité de ses identifiants.
        </p>
      </Section>

      <Section title="3. Obligations des utilisateurs">
        <p>En utilisant Nuvora, vous vous engagez à :</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
          <li>Ne pas utiliser le service à des fins illicites ou frauduleuses</li>
          <li>Ne pas tenter de perturber le fonctionnement du site</li>
          <li>Ne pas collecter les données d&apos;autres utilisateurs sans autorisation</li>
          <li>Respecter les droits de propriété intellectuelle des créateurs</li>
        </ul>
      </Section>

      <Section title="4. Référencement des produits (créateurs)">
        <p>
          Les créateurs qui soumettent leurs produits sur Nuvora s&apos;engagent à :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
          <li>Être titulaires des droits sur les produits soumis</li>
          <li>Fournir des informations exactes (titre, description, prix, lien d&apos;achat)</li>
          <li>Ne pas soumettre de contenu illicite, trompeur ou portant atteinte à des tiers</li>
          <li>Mettre à jour ou signaler tout changement concernant leurs produits</li>
        </ul>
        <p>
          Nuvora se réserve le droit de refuser ou de retirer tout produit ne
          respectant pas ces conditions, sans justification ni préavis.
        </p>
      </Section>

      <Section title="5. Responsabilité de Nuvora">
        <p>
          Nuvora agit comme intermédiaire de découverte et ne saurait être tenu
          responsable :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
          <li>De la qualité, du contenu ou de la disponibilité des produits référencés</li>
          <li>Des transactions effectuées entre acheteurs et créateurs</li>
          <li>Des litiges survenant après la redirection vers la plateforme du créateur</li>
          <li>Des interruptions temporaires du service</li>
        </ul>
      </Section>

      <Section title="6. Propriété intellectuelle">
        <p>
          Le contenu du site Nuvora (design, logo, textes, code) est protégé par les
          lois relatives à la propriété intellectuelle. Toute reproduction sans
          autorisation expresse est interdite.
        </p>
        <p>
          Les descriptions et visuels des produits référencés appartiennent à leurs
          créateurs respectifs.
        </p>
      </Section>

      <Section title="7. Modification des CGU">
        <p>
          Nuvora se réserve le droit de modifier les présentes CGU à tout moment.
          Les utilisateurs seront informés des modifications substantielles. La
          poursuite de l&apos;utilisation du service après notification vaut acceptation
          des nouvelles conditions.
        </p>
      </Section>

      <Section title="8. Droit applicable">
        <p>
          Les présentes CGU sont régies par le droit français. Tout litige relatif
          à leur interprétation ou exécution relève de la compétence exclusive des
          tribunaux français.
        </p>
      </Section>

      <p className="mt-12 text-sm text-muted">
        Dernière mise à jour : juillet 2026.
      </p>
    </div>
  );
}
