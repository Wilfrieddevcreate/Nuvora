// Données mockées Nuvora — aucune source externe, tout est en dur pour la maquette front.
// Reflète les champs produit du cahier des charges.

export type Category =
  | "Formation"
  | "Ebook"
  | "Template"
  | "Logiciel";

export type Platform =
  | "Gumroad"
  | "Chariow"
  | "Systeme.io"
  | "Podia";

export type Product = {
  slug: string;
  title: string;
  description: string;
  category: Category;
  subCategory: string;
  creator: string;
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
  return [...PRODUCTS].sort((a, b) => b.views - a.views).slice(0, limit);
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
      quote: "« J’ai doublé mes ventes grâce à Nuvora. »",
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
      quote: "« Une audience francophone qui cherchait exactement ma formation. »",
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
      quote: "« Référencer mon template ici m’a apporté de vrais clients. »",
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
