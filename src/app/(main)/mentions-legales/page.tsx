import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Nuvora — éditeur, hébergeur et informations légales obligatoires.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://nuvora.app/mentions-legales" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-fg">{title}</h2>
      <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-fg-2">{children}</div>
    </section>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-medium text-accent">Informations légales</p>
        <h1 className="mt-2 text-3xl font-extrabold">Mentions légales</h1>
        <p className="mt-3 text-fg-2">
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la
          confiance en l&apos;économie numérique (LCEN), les informations suivantes sont
          portées à la connaissance des utilisateurs du site Nuvora.
        </p>
      </div>

      <Section title="1. Éditeur du site">
        <p>Le site <strong className="text-fg">nuvora.app</strong> est édité par :</p>
        <ul className="mt-2 space-y-1 rounded-xl border border-border bg-surface p-4">
          <li><span className="font-semibold text-fg">Raison sociale :</span> Nuvora</li>
          <li><span className="font-semibold text-fg">Responsable de publication :</span> Wilfried HELOUSSATO</li>
          <li><span className="font-semibold text-fg">Contact :</span> contact@nuvora.app</li>
        </ul>
      </Section>

      <Section title="2. Hébergement">
        <p>Le site est hébergé par :</p>
        <ul className="mt-2 space-y-1 rounded-xl border border-border bg-surface p-4">
          <li><span className="font-semibold text-fg">Société :</span> Vercel Inc.</li>
          <li><span className="font-semibold text-fg">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
          <li><span className="font-semibold text-fg">Site :</span> vercel.com</li>
        </ul>
      </Section>

      <Section title="3. Activité du site">
        <p>
          Nuvora est un moteur de découverte de produits digitaux (ebooks, formations,
          templates, logiciels). Le site référence des produits créés par des tiers et
          redirige les utilisateurs vers les plateformes de vente des créateurs.
        </p>
        <p>
          <strong className="text-fg">Nuvora ne vend aucun produit et ne traite aucun paiement.</strong>{" "}
          Toute transaction est effectuée directement entre l&apos;acheteur et le créateur,
          sur la plateforme de ce dernier (Gumroad, Systeme.io, Podia, Chariow, etc.).
        </p>
      </Section>

      <Section title="4. Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments constituant le site Nuvora (design, textes, logo,
          code source) est protégé par le droit de la propriété intellectuelle et
          appartient à Nuvora ou à ses ayants droit.
        </p>
        <p>
          Les contenus des produits référencés (descriptions, visuels) appartiennent à
          leurs créateurs respectifs et sont reproduits avec leur accord dans le cadre
          du référencement.
        </p>
        <p>
          Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu
          de ce site sur quelque support que ce soit, sans l&apos;autorisation expresse de
          Nuvora, est interdite et constituerait une contrefaçon.
        </p>
      </Section>

      <Section title="5. Limitation de responsabilité">
        <p>
          Nuvora s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations
          diffusées sur ce site. Toutefois, Nuvora ne peut garantir l&apos;exactitude,
          la précision ou l&apos;exhaustivité des informations mises à disposition.
        </p>
        <p>
          Nuvora décline toute responsabilité concernant les produits vendus par les
          créateurs référencés, notamment quant à leur qualité, leur contenu ou leur
          adéquation aux besoins des acheteurs. Tout litige relatif à un achat doit
          être réglé directement avec le créateur concerné.
        </p>
      </Section>

      <Section title="6. Données personnelles">
        <p>
          Le traitement des données personnelles des utilisateurs est détaillé dans
          notre{" "}
          <a href="/confidentialite" className="font-semibold text-accent hover:text-accent-hover">
            Politique de confidentialité
          </a>
          .
        </p>
      </Section>

      <Section title="7. Droit applicable">
        <p>
          Le présent site et ses mentions légales sont soumis au droit français.
          En cas de litige, les tribunaux français seront seuls compétents.
        </p>
      </Section>

      <p className="mt-12 text-sm text-muted">
        Dernière mise à jour : juillet 2026.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-8 text-sm">
        <Link href="/" className="text-muted hover:text-fg transition-colors">Accueil</Link>
        <Link href="/catalogue" className="text-muted hover:text-fg transition-colors">Catalogue</Link>
        <Link href="/cgu" className="text-muted hover:text-fg transition-colors">CGU</Link>
        <Link href="/confidentialite" className="text-muted hover:text-fg transition-colors">Confidentialité</Link>
      </div>
    </div>
  );
}
