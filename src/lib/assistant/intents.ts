/**
 * Détection d'intentions conversationnelles en amont du modèle.
 *
 * Les messages qui n'appellent pas de recherche produit (salutation,
 * remerciement, « tu es qui ? »…) sont reconnus ici et reçoivent une réponse
 * écrite à la main : instantanée, gratuite, et de qualité constante.
 * Seules les vraies demandes de recommandation atteignent le LLM.
 */

export type AssistantIntent =
  | "greeting"
  | "thanks"
  | "goodbye"
  | "identity"
  | "unclear";

export type Chip = { label: string; query: string };

export type CannedReply = { kind: "canned"; text: string; chips: Chip[] };

export type CannedContext = {
  firstName?: string | null;
  topics: string[];
  productCount: number;
};

/** minuscules, sans accents ni ponctuation, espaces normalisés */
function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const GREETING =
  "(?:re)?(?:bonjour|bonsoir|bjr|bsr|salut|slt|coucou|cc|hello|hallo|hi|hey|yo|yop|wesh|hola|good\\s+(?:morning|evening|afternoon))";

/** formules de politesse qui accompagnent une salutation sans rien demander */
const FILLER =
  "(?:ca\\s+va|comment\\s+ca\\s+va|comment\\s+allez\\s+vous|vous\\s+allez\\s+bien|ca\\s+roule|tout\\s+le\\s+monde|a\\s+tous|l\\s+equipe|svp|stp)";

const GREETING_RE = new RegExp(
  `^(?:${GREETING}|${FILLER})(?:\\s+(?:${GREETING}|${FILLER}))*$`,
);

const THANKS_RE =
  /^(?:merci(?:\s+(?:beaucoup|bien|bcp|infiniment))?|mrc|thanks?|thank\s+you|thx|ok\s+merci|nickel|impeccable|parfait|genial|super|top|cool)$/;

const GOODBYE_RE =
  /^(?:au\s+revoir|bye|bye\s+bye|ciao|tchao|adieu|see\s+you|a\s+bientot|a\s+plus|a\s+tout\s+a\s+l\s+heure|bonne\s+journee|bonne\s+soiree|bonne\s+continuation)$/;

const IDENTITY_RE =
  /(qui\s+es\s+tu|qui\s+etes\s+vous|tu\s+es\s+qui|vous\s+etes\s+qui|presente\s+toi|c\s+est\s+quoi\s+nuvora|qu\s+est\s+ce\s+que\s+nuvora|tu\s+fais\s+quoi|que\s+fais\s+tu|que\s+peux\s+tu\s+faire|tu\s+sers\s+a\s+quoi|comment\s+ca\s+marche|comment\s+tu\s+marches|a\s+quoi\s+tu\s+sers)/;

/**
 * Renvoie l'intention conversationnelle du message, ou `null` si c'est une
 * vraie demande à confier au modèle.
 *
 * Les motifs de salutation / remerciement / au revoir sont ancrés : « bonjour »
 * est une salutation, « bonjour je cherche une formation React » ne l'est pas
 * et part vers la recherche produit.
 */
export function detectIntent(raw: string): AssistantIntent | null {
  const text = normalize(raw ?? "");

  if (text.length < 2 || !/[a-z]/.test(text)) return "unclear";
  if (IDENTITY_RE.test(text)) return "identity";
  if (GOODBYE_RE.test(text)) return "goodbye";
  if (THANKS_RE.test(text)) return "thanks";
  if (GREETING_RE.test(text)) return "greeting";

  return null;
}

function topicChips(topics: string[]): Chip[] {
  return topics.slice(0, 4).map((topic) => ({
    label: topic,
    query: `Je cherche quelque chose en ${topic.toLowerCase()}`,
  }));
}

export function buildCannedReply(
  intent: AssistantIntent,
  { firstName, topics, productCount }: CannedContext,
): CannedReply {
  const chips = topicChips(topics);

  switch (intent) {
    case "greeting":
      return {
        kind: "canned",
        text: [
          firstName ? `Bonjour ${firstName} 👋` : "Bonjour 👋",
          "Je connais tout le catalogue Nuvora. Dites-moi ce que vous cherchez — le sujet suffit pour commencer.",
        ].join("\n"),
        chips,
      };

    case "thanks":
      return {
        kind: "canned",
        text: "Avec plaisir. Si vous cherchez autre chose, je suis là.",
        chips: chips.slice(0, 3),
      };

    case "goodbye":
      return {
        kind: "canned",
        text: "À bientôt sur Nuvora 👋",
        chips: [],
      };

    case "identity":
      return {
        kind: "canned",
        text: [
          `Je suis l'assistant de Nuvora. Je connais les ${productCount} produits du catalogue — formations, ebooks, templates et logiciels — et je vous aide à trouver celui qui correspond à votre besoin.`,
          "Décrivez-le-moi en une phrase : le sujet, et si vous le savez, votre niveau ou votre budget.",
        ].join("\n\n"),
        chips,
      };

    case "unclear":
      return {
        kind: "canned",
        text: "Je n'ai pas bien saisi. Dites-moi ce que vous cherchez en quelques mots — un sujet, un format, un niveau.",
        chips,
      };
  }
}
