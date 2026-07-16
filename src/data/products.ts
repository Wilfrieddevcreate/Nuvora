// Données mockées Nuvora — aucune source externe, tout est en dur pour la maquette front.
// Reflète les champs produit du cahier des charges.

export type Category =
  | "Formation"
  | "Ebook"
  | "Template"
  | "Logiciel";

export type Platform =
  | "Chariow"
  | "Gumroad"
  | "Systeme.io"
  | "Podia";

export type Creator = {
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  verified: boolean;
  joinedYear: number;
  specialty: string;
  platform: Platform;
  color: string; // classe Tailwind bg pour l'avatar
};

export const CREATORS: Creator[] = [
  {
    slug: "studio-lumen",
    name: "Studio Lumen",
    tagline: "IA appliquée & marketing de contenu",
    bio: "Studio spécialisé dans la création de formations et ressources autour de l'intelligence artificielle et du copywriting. Nos produits sont pensés pour les créateurs et entrepreneurs qui veulent gagner du temps sans sacrifier la qualité.",
    verified: true,
    joinedYear: 2023,
    specialty: "IA & Marketing",
    platform: "Gumroad",
    color: "bg-indigo-500",
  },
  {
    slug: "amelie-r",
    name: "Amélie R.",
    tagline: "Solopreneure · Business digital",
    bio: "J'aide les solopreneurs à structurer et lancer leur première offre digitale. Après avoir accompagné plus de 200 créateurs, j'ai mis en forme ma méthode dans des guides pratiques et actionnables.",
    verified: true,
    joinedYear: 2022,
    specialty: "Business & Offre",
    platform: "Gumroad",
    color: "bg-violet-500",
  },
  {
    slug: "koda",
    name: "Koda",
    tagline: "Templates Notion pour créateurs",
    bio: "Je conçois des systèmes de productivité dans Notion pour les créateurs de contenu et freelances. Chaque template est testé en conditions réelles avant d'être publié.",
    verified: false,
    joinedYear: 2024,
    specialty: "Notion & Productivité",
    platform: "Chariow",
    color: "bg-amber-500",
  },
  {
    slug: "devacademy",
    name: "DevAcademy",
    tagline: "Formations web en français, du débutant au pro",
    bio: "DevAcademy propose des formations vidéo complètes pour apprendre le développement web en français. Plus de 40 h de contenu, des projets concrets et un accès à vie pour progresser à votre rythme.",
    verified: true,
    joinedYear: 2021,
    specialty: "Dev web",
    platform: "Systeme.io",
    color: "bg-sky-500",
  },
  {
    slug: "m-diallo",
    name: "M. Diallo",
    tagline: "Growth & acquisition sans budget pub",
    bio: "Consultant en acquisition depuis 8 ans, j'accompagne les créateurs solo qui veulent développer leur audience sans dépenser en publicité. Mes formations distillent ce qui fonctionne vraiment.",
    verified: false,
    joinedYear: 2023,
    specialty: "Growth & Marketing",
    platform: "Gumroad",
    color: "bg-emerald-500",
  },
  {
    slug: "atelier-pixel",
    name: "Atelier Pixel",
    tagline: "Design accessible & templates prêts à l'emploi",
    bio: "Atelier Pixel crée des ressources design pour les non-designers : formations Figma pédagogiques et templates professionnels (Framer, Webflow) que n'importe qui peut personnaliser en une soirée.",
    verified: false,
    joinedYear: 2023,
    specialty: "Design & Templates",
    platform: "Chariow",
    color: "bg-orange-500",
  },
  {
    slug: "c-bernard",
    name: "C. Bernard",
    tagline: "Finance personnelle sans jargon",
    bio: "Ancien analyste financier reconverti formateur, j'explique l'investissement, la bourse et la gestion de patrimoine avec des mots simples. Mon objectif : démocratiser la culture financière.",
    verified: false,
    joinedYear: 2022,
    specialty: "Finance & Investissement",
    platform: "Podia",
    color: "bg-slate-500",
  },
];

export type Product = {
  slug: string;
  title: string;
  description: string;
  category: Category;
  subCategory: string;
  creator: string;
  creatorSlug: string;
  verified: boolean;
  isNew: boolean;
  price: number; // 0 = gratuit
  currency: "EUR";
  language: "Français" | "Anglais";
  country: string;
  tags: string[];
  platform: Platform;
  externalUrl: string;
  views: number;
  clicks: number;
  cover: "hatch" | "wash" | "ink"; // style de couverture (motif généré, pas d'image externe)
};

export const CATEGORIES: Category[] = [
  "Formation",
  "Ebook",
  "Template",
  "Logiciel",
];

export const PRODUCTS: Product[] = [
  {
    slug: "maitriser-claude-agents-ia",
    title: "Maîtriser Claude & les agents IA",
    description:
      "Une formation complète pour concevoir des agents IA fiables avec Claude : prompting avancé, outils, orchestration multi-agents et mise en production.",
    category: "Formation",
    subCategory: "IA",
    creator: "Studio Lumen",
    creatorSlug: "studio-lumen",
    verified: true,
    isNew: true,
    price: 49,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["ia", "agents", "claude", "prompting"],
    platform: "Systeme.io",
    externalUrl: "https://systeme.io/",
    views: 5120,
    clicks: 602,
    cover: "wash",
  },
  {
    slug: "lancer-son-offre-30-jours",
    title: "Lancer son offre en 30 jours",
    description:
      "Le guide pas-à-pas pour passer d'une idée à une première offre digitale rentable, avec des modèles prêts à l'emploi.",
    category: "Ebook",
    subCategory: "Business",
    creator: "Amélie R.",
    creatorSlug: "amelie-r",
    verified: true,
    isNew: false,
    price: 19,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["business", "offre", "solopreneur"],
    platform: "Gumroad",
    externalUrl: "https://gumroad.com/",
    views: 3980,
    clicks: 421,
    cover: "hatch",
  },
  {
    slug: "os-createur-notion",
    title: "OS créateur — tout-en-un",
    description:
      "Un template Notion complet pour piloter son activité de créateur : produits, contenus, finances et objectifs au même endroit.",
    category: "Template",
    subCategory: "Notion",
    creator: "Koda",
    creatorSlug: "koda",
    verified: false,
    isNew: true,
    price: 29,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["notion", "productivité", "créateur"],
    platform: "Chariow",
    externalUrl: "https://chariow.com/",
    views: 2740,
    clicks: 298,
    cover: "ink",
  },
  {
    slug: "react-de-zero-a-pro",
    title: "React en français — de zéro à pro",
    description:
      "Apprendre React de A à Z, en français, avec des projets concrets. 40 h de vidéo, exercices corrigés et accès à vie sur la plateforme du créateur.",
    category: "Formation",
    subCategory: "Dev",
    creator: "DevAcademy",
    creatorSlug: "devacademy",
    verified: true,
    isNew: false,
    price: 89,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["react", "javascript", "frontend", "débutant"],
    platform: "Systeme.io",
    externalUrl: "https://systeme.io/",
    views: 4210,
    clicks: 510,
    cover: "hatch",
  },
  {
    slug: "growth-createurs-solo",
    title: "Growth pour créateurs solo",
    description:
      "Les leviers d'acquisition qui marchent vraiment quand on est seul : contenu, distribution et boucles virales, sans budget publicitaire.",
    category: "Formation",
    subCategory: "Marketing",
    creator: "M. Diallo",
    creatorSlug: "m-diallo",
    verified: false,
    isNew: false,
    price: 59,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["growth", "marketing", "acquisition"],
    platform: "Gumroad",
    externalUrl: "https://gumroad.com/",
    views: 3110,
    clicks: 344,
    cover: "wash",
  },
  {
    slug: "figma-pour-non-designers",
    title: "Figma pour non-designers",
    description:
      "Créer des visuels et maquettes propres sans être designer. Les bases de Figma expliquées simplement, avec des gabarits fournis.",
    category: "Formation",
    subCategory: "Design",
    creator: "Atelier Pixel",
    creatorSlug: "atelier-pixel",
    verified: false,
    isNew: false,
    price: 39,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["figma", "design", "ui"],
    platform: "Chariow",
    externalUrl: "https://chariow.com/",
    views: 2020,
    clicks: 187,
    cover: "ink",
  },
  {
    slug: "pack-prompts-marketing",
    title: "Pack de prompts marketing",
    description:
      "Plus de 200 prompts prêts à l'emploi pour écrire vos posts, emails et pages de vente en quelques minutes.",
    category: "Ebook",
    subCategory: "IA",
    creator: "Studio Lumen",
    creatorSlug: "studio-lumen",
    verified: true,
    isNew: true,
    price: 15,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["prompts", "marketing", "ia", "copywriting"],
    platform: "Gumroad",
    externalUrl: "https://gumroad.com/",
    views: 1520,
    clicks: 176,
    cover: "wash",
  },
  {
    slug: "portfolio-framer",
    title: "Template portfolio Framer",
    description:
      "Un portfolio Framer élégant et responsive, prêt à personnaliser en une soirée. Idéal freelances et studios.",
    category: "Template",
    subCategory: "Framer",
    creator: "Atelier Pixel",
    creatorSlug: "atelier-pixel",
    verified: false,
    isNew: true,
    price: 25,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["framer", "portfolio", "template"],
    platform: "Chariow",
    externalUrl: "https://chariow.com/",
    views: 980,
    clicks: 92,
    cover: "hatch",
  },
  {
    slug: "comprendre-investissement",
    title: "Comprendre l'investissement",
    description:
      "Les fondamentaux de l'investissement expliqués sans jargon : bourse, ETF, gestion du risque et premiers pas concrets.",
    category: "Ebook",
    subCategory: "Finance",
    creator: "C. Bernard",
    creatorSlug: "c-bernard",
    verified: false,
    isNew: false,
    price: 45,
    currency: "EUR",
    language: "Français",
    country: "France",
    tags: ["finance", "investissement", "bourse"],
    platform: "Podia",
    externalUrl: "https://www.podia.com/",
    views: 2650,
    clicks: 231,
    cover: "ink",
  },
];

export function getNewProducts(limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.isNew).slice(0, limit);
}

export function getPopularProducts(limit = 6): Product[] {
  // On exclut les nouveautés pour éviter le doublon avec la section Nouveautés.
  return [...PRODUCTS]
    .filter((p) => !p.isNew)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

// Version pour le hero/vedette : le plus populaire tous confondus.
export function getMostPopular(limit = 1): Product[] {
  return [...PRODUCTS].sort((a, b) => b.views - a.views).slice(0, limit);
}

// --- Assistant IA (maquette : matching mots-clés, aucune vraie IA) ---

// Synonymes/déclencheurs pour rapprocher le langage naturel de nos données.
const KEYWORD_HINTS: Record<string, string[]> = {
  ia: ["ia", "intelligence", "claude", "gpt", "prompt", "agent", "automatiser"],
  business: ["business", "offre", "vendre", "vente", "entreprise", "argent"],
  dev: ["dev", "code", "react", "javascript", "web", "programmation", "front"],
  design: ["design", "figma", "ui", "ux", "graphisme", "visuel"],
  marketing: ["marketing", "growth", "acquisition", "audience", "trafic"],
  finance: ["finance", "investir", "investissement", "bourse", "argent", "etf"],
  notion: ["notion", "template", "organisation", "productivité"],
  debutant: ["débutant", "debutant", "commencer", "zéro", "zero", "base"],
};

export type Recommendation = {
  product: Product;
  reason: string; // phrase de justification, contextualisée par la question
  meta: string; // specs courtes (sous-catégorie · vérifié · prix)
};

function scoreProduct(product: Product, tokens: string[]): number {
  const haystack = [
    product.title,
    product.category,
    product.subCategory,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (token.length < 3) continue;
    if (haystack.includes(token)) score += 3;
    // via synonymes
    for (const hints of Object.values(KEYWORD_HINTS)) {
      if (hints.includes(token) && hints.some((h) => haystack.includes(h))) {
        score += 2;
        break;
      }
    }
  }
  // léger bonus popularité / vérifié pour départager
  score += product.views / 100000;
  if (product.verified) score += 0.3;
  return score;
}

// Specs courtes (ligne secondaire sous la justification).
function metaFor(product: Product): string {
  const bits: string[] = [product.subCategory];
  if (product.verified) bits.push("créateur vérifié");
  bits.push(product.price === 0 ? "gratuit" : `${product.price} €`);
  return bits.join(" · ");
}

// Vraie justification : POURQUOI ce produit répond à la demande.
// Croise les mots de la question avec les caractéristiques du produit.
function reasonFor(product: Product, tokens: string[]): string {
  const has = (...words: string[]) =>
    tokens.some((t) => words.some((w) => t.includes(w) || w.includes(t)));
  const beginner = product.tags.some((t) =>
    ["débutant", "debutant", "base", "bases"].includes(t),
  );

  const clauses: string[] = [];

  // 1) Pourquoi ça correspond au sujet
  if (has("react")) {
    clauses.push("couvre précisément React avec des projets concrets");
  } else if (has("ia", "intelligence", "claude", "prompt", "agent")) {
    clauses.push("cible directement l’IA et son usage pratique");
  } else if (has("business", "offre", "vendre", "vente")) {
    clauses.push("va droit au but pour lancer et vendre votre offre");
  } else if (has("design", "figma", "ui", "ux")) {
    clauses.push("aborde le design de façon accessible");
  } else if (has("marketing", "growth", "audience", "trafic")) {
    clauses.push("se concentre sur l’acquisition et la visibilité");
  } else if (has("finance", "investir", "bourse")) {
    clauses.push("explique les bases de la finance sans jargon");
  } else if (has("notion", "template", "organiser")) {
    clauses.push("fournit un template prêt à l’emploi");
  } else {
    clauses.push(`correspond bien à la catégorie ${product.category}`);
  }

  // 2) Niveau, si demandé
  if (has("débutant", "debuter", "commencer", "zero", "base")) {
    clauses.push(
      beginner
        ? "et convient parfaitement pour débuter"
        : "et reste abordable même en partant de zéro",
    );
  }

  // 3) Élément de confiance
  if (product.verified) {
    clauses.push("créateur vérifié");
  } else if (product.views > 3000) {
    clauses.push("l’un des plus consultés sur Nuvora");
  }

  const sentence = clauses.join(", ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

/**
 * Recommandation mockée : score les produits selon les mots de la question
 * et renvoie un top-N. Aucune vraie IA — juste du matching côté client.
 */
export function recommendProducts(query: string, limit = 3): Recommendation[] {
  const tokens = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // enlève les accents pour matcher plus large
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  const scored = PRODUCTS.map((product) => ({
    product,
    score: scoreProduct(product, tokens),
  })).sort((a, b) => b.score - a.score);

  // Si rien ne matche vraiment, on retombe sur les plus populaires.
  const top = scored.filter((s) => s.score > 0.6).slice(0, limit);
  const chosen = top.length > 0 ? top : scored.slice(0, limit);

  return chosen.map(({ product }) => ({
    product,
    reason: reasonFor(product, tokens),
    meta: metaFor(product),
  }));
}

// --- Fiche produit ---

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}

// Produits similaires : même catégorie, sinon complète par les plus populaires.
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  ).sort((a, b) => b.views - a.views);

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const fillers = PRODUCTS.filter(
    (p) => p.slug !== product.slug && !sameCategory.includes(p),
  ).sort((a, b) => b.views - a.views);

  return [...sameCategory, ...fillers].slice(0, limit);
}

// --- Catalogue : filtrage & tri (côté client, sans backend) ---

export const LANGUAGES: Product["language"][] = ["Français", "Anglais"];

export const PLATFORMS: Platform[] = [
  "Chariow",
  "Gumroad",
  "Systeme.io",
  "Podia",
];

export type PriceBand = "gratuit" | "-25" | "25-100" | "100+";

export const PRICE_BANDS: { id: PriceBand; label: string }[] = [
  { id: "gratuit", label: "Gratuit" },
  { id: "-25", label: "Moins de 25 €" },
  { id: "25-100", label: "25 € – 100 €" },
  { id: "100+", label: "Plus de 100 €" },
];

export type SortId = "populaires" | "nouveautes" | "prix-asc" | "prix-desc";

export const SORTS: { id: SortId; label: string }[] = [
  { id: "populaires", label: "Populaires" },
  { id: "nouveautes", label: "Nouveautés" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
];

export type CatalogFilters = {
  query: string;
  categories: Category[];
  prices: PriceBand[];
  languages: Product["language"][];
  platforms: Platform[];
  sort: SortId;
};

function inPriceBand(price: number, band: PriceBand): boolean {
  switch (band) {
    case "gratuit":
      return price === 0;
    case "-25":
      return price > 0 && price < 25;
    case "25-100":
      return price >= 25 && price <= 100;
    case "100+":
      return price > 100;
  }
}

export function filterProducts(filters: CatalogFilters): Product[] {
  const q = filters.query.trim().toLowerCase();

  const result = PRODUCTS.filter((p) => {
    // recherche texte : titre, créateur, tags
    if (q) {
      const haystack = [p.title, p.creator, p.subCategory, ...p.tags]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    // catégories (OU)
    if (filters.categories.length && !filters.categories.includes(p.category)) {
      return false;
    }
    // prix (OU sur les tranches)
    if (
      filters.prices.length &&
      !filters.prices.some((b) => inPriceBand(p.price, b))
    ) {
      return false;
    }
    // langues (OU)
    if (filters.languages.length && !filters.languages.includes(p.language)) {
      return false;
    }
    // plateformes (OU)
    if (filters.platforms.length && !filters.platforms.includes(p.platform)) {
      return false;
    }
    return true;
  });

  switch (filters.sort) {
    case "nouveautes":
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.views - a.views);
      break;
    case "prix-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "prix-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "populaires":
    default:
      result.sort((a, b) => b.views - a.views);
  }

  return result;
}

// --- Créateurs ---

export function getCreatorBySlug(slug: string): Creator | undefined {
  return CREATORS.find((c) => c.slug === slug);
}

export function getAllCreatorSlugs(): string[] {
  return CREATORS.map((c) => c.slug);
}

export function getProductsByCreator(creatorSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.creatorSlug === creatorSlug).sort(
    (a, b) => b.views - a.views,
  );
}

// --- Produits phares du hero (carrousel), chacun avec son témoignage ---

export type Testimonial = {
  author: string;
  initials: string;
  role: string;
  quote: string;
  stats: { value: string; label: string }[];
};

export type Featured = {
  product: Product;
  testimonial: Testimonial;
};

const FEATURED_SLUGS: { slug: string; testimonial: Testimonial }[] = [
  {
    slug: "maitriser-claude-agents-ia",
    testimonial: {
      author: "Amélie R.",
      initials: "AR",
      role: "Créatrice · vérifiée",
      quote: "J’ai doublé mes ventes en référençant mes ebooks sur Nuvora. Le trafic est qualifié et régulier.",
      stats: [
        { value: "×2", label: "ventes" },
        { value: "1 204", label: "clics reçus" },
      ],
    },
  },
  {
    slug: "react-de-zero-a-pro",
    testimonial: {
      author: "Karim B.",
      initials: "KB",
      role: "Formateur · Dev",
      quote: "Une audience qui cherchait exactement ma formation. Je n’aurais pas trouvé ces clients ailleurs.",
      stats: [
        { value: "4 210", label: "vues" },
        { value: "12 %", label: "taux de clic" },
      ],
    },
  },
  {
    slug: "os-createur-notion",
    testimonial: {
      author: "Koda",
      initials: "KO",
      role: "Créateur · templates",
      quote: "Référencer mon template ici m’a apporté de vrais clients, sans budget publicitaire.",
      stats: [
        { value: "2 740", label: "vues" },
        { value: "+40", label: "ventes / mois" },
      ],
    },
  },
];

export function getFeatured(): Featured[] {
  return FEATURED_SLUGS.map(({ slug, testimonial }) => {
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product) throw new Error(`Produit phare introuvable : ${slug}`);
    return { product, testimonial };
  });
}

import type { DbProduct } from "@/components/product-card";
export function toDbProduct(p: Product): DbProduct {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    subCategory: p.subCategory,
    tags: p.tags,
    price: p.price,
    isFree: p.price === 0,
    language: p.language,
    platform: p.platform,
    views: p.views,
    clicks: p.clicks,
    creatorName: p.creator,
    creatorSlug: p.creatorSlug,
    creatorVerified: p.verified,
  };
}
