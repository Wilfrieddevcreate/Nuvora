"use client";

import { motion, type Variants } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "@/components/icons";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function CreatorHero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-accent-soft/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(55%_100%_at_50%_0%,var(--accent-soft),transparent)]"
      />
      <motion.div
        className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-8 sm:py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-fg-2 sm:text-[13px]"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          Pour les créateurs de produits digitaux
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-6 text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.06]"
        >
          Faites découvrir vos produits
          <br />
          <span className="text-accent">à ceux qui les cherchent.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-5 max-w-xl text-lg text-fg-2"
        >
          Nuvora référence vos ebooks, formations et templates gratuitement.
          Vous gardez 100&nbsp;% de vos revenus. On s&apos;occupe de la visibilité.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ButtonLink href="/inscription" size="lg">
              Référencer mes produits
              <ArrowUpRight className="size-4" />
            </ButtonLink>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ButtonLink href="/catalogue" variant="secondary" size="lg">
              Voir le catalogue
              <ArrowRight className="size-4" />
            </ButtonLink>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}