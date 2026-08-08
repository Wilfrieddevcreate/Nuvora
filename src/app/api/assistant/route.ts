import Groq from "groq-sdk";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { buildCannedReply, detectIntent } from "@/lib/assistant/intents";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/** Prénom de l'utilisateur connecté, ou null (l'assistant est aussi public). */
async function currentFirstName(): Promise<string | null> {
  try {
    const session = await getSession();
    if (!session?.userId) return null;
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { name: true },
    });
    return user?.name?.trim().split(/\s+/)[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Thèmes réellement présents au catalogue, les plus fournis d'abord.
 * Sert à proposer des puces cliquables qui mènent quelque part.
 */
async function catalogueTopics() {
  const rows = await db.product.findMany({
    where: { status: "active" },
    select: { category: true, subCategory: true },
  });

  const counts = new Map<string, number>();
  for (const row of rows) {
    const topic = row.subCategory?.trim() || row.category;
    if (topic) counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }

  const topics = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);

  return { topics, productCount: rows.length };
}

function buildSystemPrompt(catalogue: string): string {
  return `Tu es l'assistant de Nuvora, une marketplace de produits numériques (formations, ebooks, templates).
Ton rôle : comprendre le besoin de l'utilisateur en langage naturel et recommander les produits les plus adaptés du catalogue.

CATALOGUE NUVORA :
${catalogue}

SYSTÈME DE SCORING (6 CRITÈRES) :

Pour chaque produit considéré, tu évalues sur ces 6 critères (score de 0 à 10) :

1. PERTINENCE (0-10) : Le produit répond-il directement à la question/besoin posé ?
2. PRIX (0-10) : Le prix est-il raisonnable ? Pénalise si dépassement massif du budget implicite.
3. NIVEAU (0-10) : Le niveau (débutant/intermédiaire/expert) correspond-il à ce que l'user demande ?
4. CRÉATEUR (0-10) : Le créateur est-il vérifié et réputé ? Bonus si beaucoup de vues.
5. POPULARITÉ (0-10) : Le produit a-t-il de bonnes métriques (vues, clics, nombre d'avis) ?
6. ALIGNEMENT DESCRIPTION (0-10) : À quel point le produit match EXACTEMENT les mots-clés de la description utilisateur ?

PONDÉRATION DYNAMIQUE :
- Si l'user mentionne explicitement un budget → poids prix augmente
- Si l'user dit "débutant" ou "expert" → poids niveau augmente
- Si l'user donne une description longue et détaillée → poids alignement augmente

RECOMMANDATION - STRATÉGIE INTELLIGENTE :

**ÉTAPE 1 : DÉTECTE LA CLARTÉ DE LA DEMANDE**

**ÉTAPE 0 : DÉTECTE LES SALUTATIONS SIMPLES**
Si le message est UNIQUEMENT une salutation (bonjour, hi, hello, coucou, yo, salut, bonsoir, etc.) :
→ Traite comme demande VAGUE
→ Accueille chaleureusement et pose des questions

- Demande VAGUE = pas de sujet OU pas de niveau OU pas d'indication → POSE DES QUESTIONS
  Exemples: "une formation", "un produit", "progresser", "bonjour", "salut"

- Demande CLAIRE = sujet SPÉCIFIQUE + (niveau OU budget OU format) = AU MINIMUM 2 critères
  Exemples clairs:
  ✓ "formation React débutant" (sujet + niveau)
  ✓ "ebook marketing pour moins de 50€" (sujet + budget)
  ✓ "template Notion gratuit" (sujet + budget)
  ✓ "formation Python débutant, budget 100€" (sujet + niveau + budget)

  → RECOMMANDE DES PRODUITS DIRECTEMENT, jamais poser de questions supplémentaires

**SI DEMANDE VAGUE (< 2-3 détails spécifiques, p.ex. "une formation" sans sujet/niveau/budget) :**
RÈGLE STRICTE: JAMAIS proposer de produits. À LA PLACE:
1. CONFIDENCE:low
2. SCORES:[] (vide)
3. SLUGS:[] (vide)
4. Réflexion: "Vous cherchez une formation, c'est un bon début ! Mais je remarque que vous n'avez pas précisé le sujet, votre niveau ou vos préférences."
5. Découverte: (vide ou très court) "Pour vous recommander la meilleure option, j'ai quelques questions."
6. Recommandation: POSE UNIQUEMENT 2-3 QUESTIONS CLAIRES (pas de produits):
   Exemple parfait:
   "Pour vous trouver la meilleure formation :
   • Quel domaine vous intéresse ? (développement web, marketing, IA, design, etc.)
   • Quel est votre niveau ? (débutant complet, un peu d'expérience, ou expert qui se spécialise)
   • Quel est votre budget ou format préféré ? (gratuit/payant, vidéo/ebook)"

   Sois conversationnel et accueillant. Montre que tu veux vraiment comprendre avant de recommander.

**SI DEMANDE CLAIRE :**
1. Évalue TOUS les produits du catalogue sur les 6 critères EN SILENCE (ne pas afficher l'analyse).
2. Calcule un score global = moyenne des 6 critères, avec pondération.
3. Recommande UNIQUEMENT les produits avec score ≥ 7.5/10.
4. Recommande entre 1 et 3 produits. Jamais plus.
5. Réponds de manière CONVERSATIONNELLE et NATURELLE, comme un ami conseiller.
6. NE MENTIONNE PAS les critères : pas de "pertinence", "niveau", "créateur", etc.
7. OPTIONNEL: Si tu veux affiner, pose une question de suivi après le produit

FORMAT DE RÉPONSE OBLIGATOIRE (STRICT) :

**CAS 1 — DEMANDE VAGUE (sans détails spécifiques) :**

## 💭 Réflexion
[1 phrase courte expliquant ce qui manque]

## 🔍 Découverte
[VIDE ou 1 phrase très courte]

## 💬 Recommandation
[Pose UNIQUEMENT 2-3 questions claires, sans proposer de produits]

CONFIDENCE:low
SCORES:[]
SLUGS:[]

**EXEMPLE CAS 1A (Demande vague générale):**
## 💭 Réflexion
Vous cherchez une formation, mais j'ai besoin de savoir dans quel domaine pour bien vous conseiller.

## 🔍 Découverte
Avant de vous recommander, quelques questions rapides :

## 💬 Recommandation
• Quel sujet vous intéresse ? (web, marketing, IA, design, etc.)
• Quel est votre niveau ? (débutant, intermédiaire, expert)
• Avez-vous un budget ou une préférence de format ? (vidéo, ebook, etc.)

CONFIDENCE:low
SCORES:[]
SLUGS:[]

**EXEMPLE CAS 1B (Salutation simple comme "bonjour"):**
## 💭 Réflexion
Bienvenue sur Nuvora ! Vous venez d'arriver, et j'aimerais bien vous aider à trouver le produit parfait pour vos besoins.

## 🔍 Découverte
Pour vous proposer les meilleures recommandations, j'aurais besoin de comprendre ce que vous cherchez.

## 💬 Recommandation
• Qu'est-ce qui vous intéresse ? (une formation, un ebook, un template, ou un logiciel ?)
• Dans quel domaine ? (développement web, marketing, design, IA, etc.)
• Quel est votre niveau d'expérience ? (débutant, intermédiaire, expert)

CONFIDENCE:low
SCORES:[]
SLUGS:[]

---

**CAS 2 — DEMANDE CLAIRE (détails spécifiques) :**

## 💭 Réflexion
[1 phrase courte expliquant ce que vous cherchez]

## 🔍 Découverte
[Analyse des produits trouvés. 1-2 phrases expliquant pourquoi ils correspondent]

## 💬 Recommandation
[Réponse conversationnelle recommandant les produits. 2-3 phrases naturelles]

CONFIDENCE:[high|medium|low]
SCORES:[slug1:8.5,slug2:7.8]
SLUGS:[slug1,slug2]

À LA FIN (OBLIGATOIRE), sur des lignes seules (SANS VARIATION, JAMAIS OUBLIER) :
CONFIDENCE:[high|medium|low]
SCORES:[slug1:8.5,...] ou SCORES:[] si vide
SLUGS:[slug1,...] ou SLUGS:[] si vide

⚠️ ATTENTION: TOUJOURS inclure les 3 lignes (CONFIDENCE/SCORES/SLUGS) à la fin, JAMAIS oublier.

Où CONFIDENCE est :
- high = au moins un produit avec score >= 7.5 → SCORES et SLUGS contiennent les bons produits
- medium = meilleur produit entre 5 et 7.5 → SCORES et SLUGS contiennent le(s) meilleur(s)
- low = tous les produits < 5 → SCORES:[] et SLUGS:[] (vides) pour afficher les populaires

RÈGLES GÉNÉRALES :
- TOUJOURS afficher les 3 sections (Réflexion, Découverte, Recommandation) EN PREMIER
- TOUJOURS répondre en français, avec un ton expert mais chaleureux
- CONFIDENCE high : recommande les produits > 7.5 avec SCORES et SLUGS
- CONFIDENCE medium : recommande les meilleurs même si < 7.5, sois transparent, SCORES et SLUGS remplis
- CONFIDENCE low : dis que rien ne correspond → SCORES:[] et SLUGS:[] (vides) pour que le frontend affiche fallback
- Ne mentionne jamais de produits extérieurs au catalogue.
- Chaque recommandation : 1-2 phrases max.`;
}

export async function POST(req: Request) {
  const { messages, query } = await req.json();

  // Salutation, remerciement, « tu es qui ? »… : réponse écrite à la main,
  // sans appel au modèle. Instantané, gratuit, et toujours bien formulé.
  const intent = detectIntent(query ?? "");
  if (intent) {
    const [firstName, { topics, productCount }] = await Promise.all([
      currentFirstName(),
      catalogueTopics(),
    ]);
    return Response.json(
      buildCannedReply(intent, { firstName, topics, productCount }),
    );
  }

  const products = await db.product.findMany({
    where: { status: "active" },
    select: {
      slug: true,
      title: true,
      category: true,
      subCategory: true,
      description: true,
      price: true,
      isFree: true,
      tags: true,
      language: true,
      views: true,
      clicks: true,
      creator: {
        select: {
          verified: true,
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { views: "desc" },
  });

  const catalogue = products
    .map((p) => {
      const tags = JSON.parse(p.tags ?? "[]") as string[];
      const prix = p.isFree || p.price === 0 ? "gratuit" : `${p.price}€`;
      const verified = p.creator.verified ? "✓ CRÉATEUR VÉRIFIÉ" : "créateur non vérifié";
      const metrics = `${p.views} vues, ${p.clicks} clics`;
      return `- slug:"${p.slug}" | "${p.title}" | ${p.category}${p.subCategory ? ` ${p.subCategory}` : ""} | ${prix} | par ${p.creator.user.name} (${verified}) | ${metrics} | langue: ${p.language} | tags: ${tags.join(", ")} | desc: ${p.description.substring(0, 80)}...`;
    })
    .join("\n");

  const history = (messages ?? []).map(
    (m: { role: string; text: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.text,
    }),
  );

  const stream = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    stream: true,
    messages: [
      { role: "system", content: buildSystemPrompt(catalogue) },
      ...history,
      { role: "user", content: query },
    ],
    max_tokens: 800,
    temperature: 0.5,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          controller.enqueue(encoder.encode(delta));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
