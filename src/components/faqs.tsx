"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const accordionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function Faqs({ FAQS }: { FAQS: { q: string; a: string }[] }) {
  // Gestion de l'état d'ouverture (index de l'élément actif, ou null si tout est fermé)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-surface-2/50">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={headerVariants}
        >
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Questions fréquentes
          </h2>
          <p className="mt-2 text-fg-2">
            Tout ce qu&apos;il faut savoir avant de commencer.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-soft"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={accordionVariants}
        >
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.q} className="px-6 py-5">
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-semibold text-fg"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <motion.svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 shrink-0 text-muted"
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </motion.svg>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-[15px] leading-relaxed text-fg-2">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}