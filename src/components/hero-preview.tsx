import { db } from "@/lib/db";

const COVER: Record<string, string> = {
  Formation:
    "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template:
    "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel:
    "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};

/**
 * Colonne droite du hero (style Estatery) : une carte produit vedette nette,
 * avec une carte-témoignage flottante posée par-dessus (preuve sociale).
 * Statique et sobre.
 */
export async function HeroPreview() {
  const featured = await db.product.findFirst({
    where: { status: "active" },
    orderBy: { views: "desc" },
    include: { creator: { include: { user: { select: { name: true } } } } },
  });

  if (!featured) return null;

  return (
    <div className="relative">
      {/* profondeur : cartes en léger décalage derrière */}
      <div
        aria-hidden
        className="absolute -right-3 top-5 h-full w-full rounded-3xl border border-border bg-surface/60"
      />
      <div
        aria-hidden
        className="absolute -right-1.5 top-2.5 h-full w-full rounded-3xl border border-border bg-surface/80"
      />

      {/* carte vedette */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-soft-lg">
        <div
          className={`flex aspect-16/11 items-center justify-center bg-linear-to-br ${COVER[featured.category]}`}
        >
          {featured.coverImage ? (
            <img src={featured.coverImage} alt={featured.title} className="size-full object-cover" />
          ) : (
            <span className="text-4xl sm:text-5xl font-extrabold text-fg/15">
              {featured.title.charAt(0)}
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <span>{featured.category}</span>
            <span className="size-1 rounded-full bg-border-2" />
            <span>{featured.subCategory}</span>
          </div>
          <h3 className="mt-2 text-lg font-bold leading-snug">
            {featured.title}
          </h3>
          <div className="mt-1 text-sm text-muted">par {featured.creator.user.name}</div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-extrabold">{featured.isFree ? "Gratuit" : `${featured.price} €`}</span>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              {featured.platform}
            </span>
          </div>
        </div>
      </div>

      {/* carte-témoignage flottante (preuve sociale) — à cheval sur le coin */}
      <div className="absolute -left-8 top-16 w-60 rounded-2xl border border-border bg-surface p-3.5 shadow-soft-lg xl:-left-12">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-[13px] font-bold text-accent-fg">
            AR
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold">Amélie R.</div>
            <div className="text-[11px] text-muted">Créatrice · vérifiée</div>
          </div>
        </div>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-fg-2">
          « J’ai doublé mes ventes grâce à Nuvora. »
        </p>
        <div className="mt-2.5 flex items-center gap-4 border-t border-border pt-2.5">
          <div>
            <div className="text-[13px] font-extrabold">×2</div>
            <div className="text-[10.5px] text-muted">ventes</div>
          </div>
          <div>
            <div className="text-[13px] font-extrabold">1 204</div>
            <div className="text-[10.5px] text-muted">clics reçus</div>
          </div>
        </div>
      </div>
    </div>
  );
}
