import Link from "next/link";
import {
  BookIcon,
  PlayIcon,
  LayoutIcon,
  TerminalIcon,
} from "@/components/icons";
import type { Category } from "@/data/products";
import type { ComponentType, SVGProps } from "react";

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

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {TILES.map(({ category, label, desc, icon: Icon, tint }) => (
        <Link
          key={category}
          href={`/catalogue?categorie=${encodeURIComponent(category)}`}
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-border-2 hover:shadow-soft"
        >
          <span className={`grid size-11 place-items-center rounded-xl ${tint}`}>
            <Icon className="size-5.5" />
          </span>
          <div>
            <div className="font-bold group-hover:text-accent">{label}</div>
            <div className="text-[13px] text-muted">{desc}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
