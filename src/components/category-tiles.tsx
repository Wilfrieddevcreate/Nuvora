"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BookIcon,
  PlayIcon,
  LayoutIcon,
  TerminalIcon,
} from "@/components/icons";
import type { Category } from "@/data/products";
import type { ComponentType, SVGProps } from "react";

// On crée un composant Link animé pour conserver le routing natif de Next.js
const MotionLink = motion.create(Link);

type Tile = {
  category: Category;
  label: string;
  desc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tint: string;
};

const TILES: Tile[] = [
  {
    category: "Formation",
    label: "Formations",
    desc: "Vidéos & cours",
    icon: PlayIcon,
    tint: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/15",
  },
  {
    category: "Ebook",
    label: "Ebooks",
    desc: "Guides & livres",
    icon: BookIcon,
    tint: "text-sky-500 bg-sky-50 dark:bg-sky-500/15",
  },
  {
    category: "Template",
    label: "Templates",
    desc: "Notion, Figma…",
    icon: LayoutIcon,
    tint: "text-amber-500 bg-amber-50 dark:bg-amber-500/15",
  },
  {
    category: "Logiciel",
    label: "Logiciels",
    desc: "Outils & apps",
    icon: TerminalIcon,
    tint: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/15",
  },
];

// Variantes pour le conteneur (gère la cascade/stagger des enfants)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Délai de 80ms entre l'apparition de chaque tuile
    },
  },
};

// Variantes pour chaque tuile individuelle
const tileVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 120 },
  },
};

export function CategoryTiles() {
  return (
    <motion.div 
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {TILES.map(({ category, label, desc, icon: Icon, tint }) => (
        <MotionLink
          key={category}
          href={`/catalogue?categorie=${encodeURIComponent(category)}`}
          variants={tileVariants}
          // On peut aussi ajouter un micro-effet au survol direct avec Motion en plus de tes classes Tailwind !
          whileHover={{ y: -2 }} 
          whileTap={{ scale: 0.98 }}
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-2 hover:shadow-soft"
        >
          <span className={`grid size-11 place-items-center rounded-xl ${tint}`}>
            <Icon className="size-5.5" />
          </span>
          <div>
            <div className="font-bold group-hover:text-accent">{label}</div>
            <div className="text-[13px] text-muted">{desc}</div>
          </div>
        </MotionLink>
      ))}
    </motion.div>
  );
}