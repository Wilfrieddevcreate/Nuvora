"use client";

import { motion, type Variants } from "framer-motion";

interface BenefitItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

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
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function CreatorBenefits({ BENEFITS }: { BENEFITS: BenefitItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={headerVariants}
      >
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Pourquoi choisir Nuvora ?
        </h2>
        <p className="mt-2 text-fg-2">
          Une vitrine de découverte pensée pour mettre vos produits devant les bonnes personnes.
        </p>
      </motion.div>

      <motion.div
        className="mt-10 grid gap-4 sm:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {BENEFITS.map((b) => (
          <motion.div
            key={b.title}
            variants={itemVariants}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="group flex gap-5 rounded-2xl border border-border bg-surface p-6 shadow-soft transition-shadow duration-200 hover:shadow-soft-lg"
          >
            <motion.span
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden="true"
              >
                {b.icon}
              </svg>
            </motion.span>
            <div className="min-w-0">
              <h3 className="font-bold">{b.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-fg-2">
                {b.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}