"use client";

import { motion, type Variants } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowUpRight } from "@/components/icons";

interface StepItem {
  n: string;
  title: string;
  desc: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

const lineVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 },
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

export function CreatorHowItWorks({ HOW_IT_WORKS }: { HOW_IT_WORKS: StepItem[] }) {
  return (
    <section className="bg-surface-2/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={headerVariants}
        >
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Référencez en 3 étapes
          </h2>
          <p className="mt-2 text-fg-2">
            Pas de technicité requise. Si vous avez déjà un produit en vente quelque part, c&apos;est suffisant.
          </p>
        </motion.div>

        <div className="relative mt-12">
          <motion.div
            aria-hidden
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={lineVariants}
            className="absolute left-1/2 top-5 hidden h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-border to-transparent md:block"
          />

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {HOW_IT_WORKS.map((step) => (
              <motion.div
                key={step.n}
                variants={itemVariants}
                className="flex flex-col items-center text-center"
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="relative z-10 grid size-11 place-items-center rounded-full bg-accent font-bold text-accent-fg shadow-soft"
                >
                  {step.n}
                </motion.span>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-2">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ButtonLink href="/inscription" size="lg">
              Commencer gratuitement
              <ArrowUpRight className="size-4" />
            </ButtonLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}