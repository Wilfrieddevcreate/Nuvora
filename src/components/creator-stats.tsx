"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  type Variants,
} from "framer-motion";

interface StatItem {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 200, suffix: "+", label: "produits référencés" },
  { target: 37, label: "créateurs actifs" },
  { target: 0, suffix: " %", label: "de commission Nuvora" },
  { target: 72, suffix: " h", label: "délai max de validation" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function Counter({ target, prefix = "", suffix = "" }: Omit<StatItem, "label">) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [isInView, count, target]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function CreatorStats() {
  return (
    <section className="border-b border-border bg-surface">
      <motion.div
        className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-border px-5 sm:grid-cols-4 sm:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
        {STATS.map((s) => (
          <motion.div
            key={s.label}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="py-8 text-center sm:py-10"
          >
            <p className="text-2xl font-extrabold text-accent sm:text-3xl">
              <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}