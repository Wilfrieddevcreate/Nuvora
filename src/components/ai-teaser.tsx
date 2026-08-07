"use client";

import { motion, type Variants } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, SparkleIcon } from "@/components/icons";

const PICKS = [
  { rank: 1, title: "React en français — de zéro à pro", meta: "Idéale débutants · 89 €" },
  { rank: 2, title: "Les bases du web moderne", meta: "À voir avant · 39 €" },
  { rank: 3, title: "React avancé & performance", meta: "Pour plus tard · 120 €" },
];

// Typage explicite des Variants pour éviter les erreurs TypeScript/Framer Motion
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
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const chatContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.4 },
  },
};

const userBubbleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, x: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const aiResponseVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, x: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { type: "spring", stiffness: 160, damping: 18 },
  },
};

export function AiTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      {/* La Grid englobe LES DEUX colonnes */}
      <motion.div
        className="grid items-center gap-10 rounded-3xl border border-border bg-surface p-8 shadow-soft sm:p-12 lg:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Colonne 1  */}
        <div className="flex flex-col items-start gap-4">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-[13px] font-semibold text-accent"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
            >
              <SparkleIcon className="size-4" />
            </motion.div>
            Assistant IA
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-2xl font-extrabold sm:text-3xl">
            Décrivez ce que vous cherchez. L’IA s’occupe du reste.
          </motion.h2>

          <motion.p variants={itemVariants} className="max-w-md text-fg-2">
            Pas besoin de connaître le bon mot-clé. Posez votre question en
            français, l’assistant compare les produits et vous explique
            lesquels choisir — et pourquoi.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-2">
            <ButtonLink href="/assistant" size="lg">
              Essayer l’assistant
              <ArrowRight className="size-4" />
            </ButtonLink>
          </motion.div>
        </div>

        {/* Colonne 2  */}
        <motion.div
          className="rounded-2xl border border-border bg-bg p-4 shadow-inner"
          variants={chatContainerVariants}
        >
          {/* Question utilisateur */}
          <motion.div className="flex justify-end" variants={userBubbleVariants}>
            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-sm text-accent-fg shadow-md">
              Je cherche une formation React en français, pour débuter.
            </p>
          </motion.div>

           <motion.div
            className="mt-3 max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3 shadow-lg"
            variants={aiResponseVariants}
          >
            <p className="text-sm text-fg-2">
              Voici les 3 formations les plus adaptées, classées pour vous :
            </p>
            <ul className="mt-3 space-y-2">
              {PICKS.map((p, index) => (
                <motion.li
                  key={p.rank}
                  className="flex items-center gap-3 rounded-xl border border-border bg-bg px-3 py-2 transition-colors duration-200"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.8 + index * 0.1, duration: 0.3 },
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -1 }}
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
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}