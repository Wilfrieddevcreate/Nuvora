"use client";

import { motion, type Variants } from "framer-motion";

const STEPS = [
  {
    n: "1",
    title: "Découvrez",
    desc: "Explorez le catalogue ou décrivez votre besoin à l’assistant IA. Nuvora sélectionne les meilleurs produits pour vous.",
  },
  {
    n: "2",
    title: "Comparez",
    desc: "Consultez les fiches, les avis et les créateurs vérifiés pour choisir en confiance, sans vous perdre.",
  },
  {
    n: "3",
    title: "Achetez ailleurs",
    desc: "On vous redirige vers la plateforme du créateur (Gumroad, Chariow, Systeme.io…) pour finaliser l’achat.",
  },
];

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

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HowItsWork() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft sm:p-12">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={headerVariants}
        >
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Comment ça marche
          </h2>
          <p className="mt-2 text-fg-2">
            Nuvora est un moteur de découverte, pas une boutique. On vous
            oriente, l’achat se fait toujours chez le créateur.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.n}
              variants={itemVariants}
              className="flex flex-col items-start"
            >
              <motion.span
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="grid size-10 place-items-center rounded-full bg-accent-soft font-bold text-accent"
              >
                {s.n}
              </motion.span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-[15px] text-fg-2">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}