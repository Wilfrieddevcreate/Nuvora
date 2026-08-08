"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

export default function FadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
    >
      {children}
    </motion.div>
  );
}