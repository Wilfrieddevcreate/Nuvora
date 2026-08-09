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
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-14">
      {/* La Grid englobe LES DEUX colonnes */}
      <motion.div
        className="grid items-center gap-8 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:gap-10 sm:rounded-3xl sm:p-8 lg:grid-cols-2 lg:p-12"
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

          <motion.h2
            variants={itemVariants}
            className="text-balance text-xl font-extrabold leading-tight sm:text-2xl lg:text-3xl"
          >
            Décrivez ce que vous cherchez. L’IA s’occupe du reste.
          </motion.h2>

          <motion.p variants={itemVariants} className="max-w-md text-[15px] text-fg-2 sm:text-base">
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
          className="rounded-2xl border border-border bg-bg p-3 shadow-inner sm:p-4"
          variants={chatContainerVariants}
        >
          {/* Question utilisateur */}
          <motion.div className="flex justify-end" variants={userBubbleVariants}>
            <p className="max-w-[92%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-[13px] text-accent-fg shadow-md sm:max-w-[85%] sm:px-4 sm:text-sm">
              Je cherche une formation React en français, pour débuter.
            </p>
          </motion.div>

           <motion.div
            className="mt-3 rounded-2xl rounded-bl-md border border-border bg-surface px-3.5 py-3 shadow-lg sm:max-w-[92%] sm:px-4"
            variants={aiResponseVariants}
          >
            <p className="text-sm text-fg-2">
              Voici les 3 formations les plus adaptées, classées pour vous :
            </p>
            <ul className="mt-3 space-y-2">
              {PICKS.map((p, index) => (
                <motion.li
                  key={p.rank}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-bg px-2.5 py-2 transition-colors duration-200 sm:gap-3 sm:px-3"
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
                    <span className="line-clamp-2 text-[13px] font-semibold leading-snug sm:truncate">
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