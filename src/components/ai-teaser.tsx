import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, SparkleIcon } from "@/components/icons";

// Aperçu (mock, non fonctionnel) d'une conversation avec l'assistant.
const PICKS = [
  { rank: 1, title: "React en français — de zéro à pro", meta: "Idéale débutants · 89 €" },
  { rank: 2, title: "Les bases du web moderne", meta: "À voir avant · 39 €" },
  { rank: 3, title: "React avancé & performance", meta: "Pour plus tard · 120 €" },
];

/**
 * Teaser de l'assistant IA — le différenciateur de Nuvora.
 * Montre une recherche en langage naturel qui donne un classement expliqué.
 * L'aperçu est illustratif (pas de vraie IA ici).
 */
export function AiTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid items-center gap-10 rounded-3xl border border-border bg-surface p-8 shadow-soft sm:p-12 lg:grid-cols-2">
        {/* Colonne texte */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-[13px] font-semibold text-accent">
            <SparkleIcon className="size-4" />
            Assistant IA
          </div>
          <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
            Décrivez ce que vous cherchez. L’IA s’occupe du reste.
          </h2>
          <p className="mt-3 max-w-md text-fg-2">
            Pas besoin de connaître le bon mot-clé. Posez votre question en
            français, l’assistant compare les produits et vous explique
            lesquels choisir — et pourquoi.
          </p>
          <div className="mt-6">
            <ButtonLink href="/assistant" size="lg">
              Essayer l’assistant
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>

        {/* Colonne aperçu conversation */}
        <div className="rounded-2xl border border-border bg-bg p-4">
          {/* question utilisateur */}
          <div className="flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm text-accent-fg">
              Je cherche une formation React en français, pour débuter.
            </p>
          </div>

          {/* réponse IA */}
          <div className="mt-3 max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3">
            <p className="text-sm text-fg-2">
              Voici les 3 formations les plus adaptées, classées pour vous :
            </p>
            <ul className="mt-3 space-y-2">
              {PICKS.map((p) => (
                <li
                  key={p.rank}
                  className="flex items-center gap-3 rounded-xl border border-border bg-bg px-3 py-2"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                    {p.rank}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">
                      {p.title}
                    </span>
                    <span className="block text-[11px] text-muted">
                      {p.meta}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
