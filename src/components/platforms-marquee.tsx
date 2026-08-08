"use client";

import { motion } from "framer-motion";

interface PlatformItem {
  name: string;
  letter: string;
  color: string;
  desc: string;
}

export default function PlatformsMarquee({ PLATFORMS }: { PLATFORMS: PlatformItem[] }) {
  const duplicatedPlatforms = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS];

  return (
    <section className="mx-auto max-w-6xl overflow-hidden px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Compatible avec vos outils
        </h2>
        <p className="mt-2 text-fg-2">
          Vous vendez déjà sur une de ces plateformes ? Il vous suffit de nous donner le lien.
        </p>
      </div>

      <div className="relative mt-10 w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          className="flex w-max gap-4 py-2"
          animate={{ x: ["0%", "-33.333333%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {duplicatedPlatforms.map((p, index) => (
            <motion.div
              key={`${p.name}-${index}`}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex w-44 shrink-0 flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-center shadow-soft"
            >
              <span
                className="grid size-12 place-items-center rounded-xl text-lg font-extrabold text-white"
                style={{ backgroundColor: p.color }}
              >
                {p.letter}
              </span>
              <div>
                <p className="text-sm font-bold">{p.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Et toute autre plateforme avec un lien de vente public.
      </p>
    </section>
  );
}