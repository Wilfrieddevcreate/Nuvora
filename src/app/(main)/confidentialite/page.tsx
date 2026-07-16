import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Nuvora — comment nous collectons, utilisons et protégeons vos données personnelles.",
  robots: { index: true, follow: false },
  alternates: { canonical: "https://nuvora.app/confidentialite" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-fg">{title}</h2>
      <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-fg-2">{children}</div>
    </section>
  );
}

function DataTable({ rows }: { rows: { type: string; purpose: string; duration: string }[] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface-2 text-left">
          <tr>
            <th className="px-4 py-3 font-semibold text-fg">Données</th>
            <th className="px-4 py-3 font-semibold text-fg">Finalité</th>
            <th className="px-4 py-3 font-semibold text-fg">Durée</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {rows.map((r) => (
            <tr key={r.type}>
              <td className="px-4 py-3 text-fg">{r.type}</td>
              <td className="px-4 py-3 text-muted">{r.purpose}</td>
              <td className="px-4 py-3 text-muted">{r.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-medium text-accent">Vie privée</p>
        <h1 className="mt-2 text-3xl font-extrabold">Politique de confidentialité</h1>
        <p className="mt-3 text-fg-2">
          Nuvora s&apos;engage à protéger vos données personnelles. Cette politique décrit
          quelles données nous collectons, pourquoi, et comment vous pouvez exercer
          vos droits conformément au RGPD.
        </p>
      </div>

      <Section title="1. Responsable du traitement">
        <ul className="space-y-1 rounded-xl border border-border bg-surface p-4">
          <li><span className="font-semibold text-fg">Entité :</span> Nuvora</li>
          <li><span className="font-semibold text-fg">Responsable :</span> Wilfried HELOUSSATO</li>
          <li>
            <span className="font-semibold text-fg">Contact DPO :</span>{" "}
            <a href="mailto:privacy@nuvora.app" className="text-accent hover:text-accent-hover">
              privacy@nuvora.app
            </a>
          </li>
        </ul>
      </Section>

      <Section title="2. Données collectées et finalités">
        <p>Nous collectons uniquement les données nécessaires au fonctionnement du service.</p>
        <DataTable
          rows={[
            {
              type: "Adresse e-mail",
              purpose: "Création de compte, connexion, réinitialisation de mot de passe",
              duration: "Jusqu&apos;à suppression du compte",
            },
            {
              type: "Prénom, nom",
              purpose: "Personnalisation de l&apos;interface et du profil créateur",
              duration: "Jusqu&apos;à suppression du compte",
            },
            {
              type: "Mot de passe (chiffré)",
              purpose: "Authentification sécurisée",
              duration: "Jusqu&apos;à suppression du compte",
            },
            {
              type: "Données de navigation",
              purpose: "Amélioration du service, statistiques anonymes",
              duration: "13 mois maximum",
            },
            {
              type: "Produits soumis (créateurs)",
              purpose: "Référencement dans le catalogue Nuvora",
              duration: "Jusqu&apos;au retrait du produit",
            },
          ]}
        />
      </Section>

      <Section title="3. Base légale des traitements">
        <ul className="list-inside list-disc space-y-1 pl-2">
          <li><strong className="text-fg">Exécution du contrat</strong> : création et gestion de votre compte</li>
          <li><strong className="text-fg">Intérêt légitime</strong> : amélioration du service, statistiques anonymes</li>
          <li><strong className="text-fg">Consentement</strong> : communications marketing (si vous y avez souscrit)</li>
          <li><strong className="text-fg">Obligation légale</strong> : conservation de certaines données à des fins comptables</li>
        </ul>
      </Section>

      <Section title="4. Partage des données">
        <p>
          Nuvora ne vend jamais vos données personnelles. Elles peuvent être partagées
          avec :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
          <li><strong className="text-fg">Vercel</strong> (hébergement) — serveurs en Union Européenne</li>
          <li><strong className="text-fg">Prestataires techniques</strong> (emailing transactionnel) — dans le cadre de contrats conformes au RGPD</li>
          <li><strong className="text-fg">Autorités compétentes</strong> — si requis par la loi</li>
        </ul>
        <p>
          Aucun transfert de données hors UE n&apos;est effectué sans garanties appropriées
          (clauses contractuelles types de la Commission européenne).
        </p>
      </Section>

      <Section title="5. Cookies">
        <p>
          Nuvora utilise des cookies strictement nécessaires au fonctionnement du
          service (session, préférences de thème). Aucun cookie publicitaire ou de
          tracking tiers n&apos;est déposé sans votre consentement explicite.
        </p>
        <p>
          Vous pouvez configurer votre navigateur pour refuser les cookies, mais
          certaines fonctionnalités pourraient en être affectées.
        </p>
      </Section>

      <Section title="6. Vos droits (RGPD)">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
          <li><strong className="text-fg">Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
          <li><strong className="text-fg">Droit de rectification</strong> : corriger des données inexactes</li>
          <li><strong className="text-fg">Droit à l&apos;effacement</strong> : supprimer vos données (« droit à l&apos;oubli »)</li>
          <li><strong className="text-fg">Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
          <li><strong className="text-fg">Droit d&apos;opposition</strong> : vous opposer à certains traitements</li>
          <li><strong className="text-fg">Droit à la limitation</strong> : restreindre le traitement de vos données</li>
        </ul>
        <p>
          Pour exercer vos droits, contactez-nous à{" "}
          <a href="mailto:privacy@nuvora.app" className="font-semibold text-accent hover:text-accent-hover">
            privacy@nuvora.app
          </a>
          . Nous répondons dans un délai de 30 jours. En cas de litige, vous pouvez
          saisir la{" "}
          <strong className="text-fg">CNIL</strong> (Commission Nationale de
          l&apos;Informatique et des Libertés).
        </p>
      </Section>

      <Section title="7. Sécurité">
        <p>
          Nuvora met en œuvre des mesures techniques et organisationnelles appropriées
          pour protéger vos données : chiffrement des mots de passe (bcrypt), HTTPS
          obligatoire, accès restreint aux données en interne.
        </p>
      </Section>

      <Section title="8. Modifications">
        <p>
          Cette politique peut être mise à jour. En cas de modification substantielle,
          nous vous informerons par email ou via une notification sur le site.
          La date de dernière mise à jour est indiquée ci-dessous.
        </p>
      </Section>

      <p className="mt-12 text-sm text-muted">
        Dernière mise à jour : juillet 2026.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-8 text-sm">
        <Link href="/" className="text-muted hover:text-fg transition-colors">Accueil</Link>
        <Link href="/catalogue" className="text-muted hover:text-fg transition-colors">Catalogue</Link>
        <Link href="/cgu" className="text-muted hover:text-fg transition-colors">CGU</Link>
        <Link href="/mentions-legales" className="text-muted hover:text-fg transition-colors">Mentions légales</Link>
      </div>
    </div>
  );
}
