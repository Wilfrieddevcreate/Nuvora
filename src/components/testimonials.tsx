import { getFeatured } from "@/data/products";

/**
 * Section preuve sociale — 3 avis de créateurs.
 * Pas d'étoiles/note (fausse preuve sociale au lancement) : on met en avant
 * la citation, des stats concrètes et le créateur vérifié.
 * Placée là où la preuve sociale convertit (pas en carrousel dans le hero).
 */
export function Testimonials() {
  const featured = getFeatured();

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Ils font confiance à Nuvora
        </h2>
        <p className="mt-2 text-fg-2">
          Des créateurs gagnent en visibilité et en ventes en référençant
          leurs produits.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {featured.map(({ product, testimonial }) => (
          <figure
            key={product.slug}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-soft"
          >
            {/* guillemet décoratif */}
            <span
              aria-hidden
              className="font-serif text-5xl leading-[0.6] text-accent/25"
            >
              &ldquo;
            </span>

            {/* citation */}
            <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-fg">
              {testimonial.quote}
            </blockquote>

            {/* stats du créateur */}
            <div className="mt-6 flex items-center gap-6 rounded-xl bg-surface-2 px-4 py-3">
              {testimonial.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-lg font-extrabold leading-none">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>

            {/* auteur */}
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-fg">
                {testimonial.initials}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">
                  {testimonial.author}
                </div>
                <div className="text-xs text-muted">{testimonial.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
