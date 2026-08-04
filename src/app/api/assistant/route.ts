import Groq from "groq-sdk";
import { db } from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

RECOMMANDATION :
1. Évalue TOUS les produits du catalogue sur ces 6 critères EN SILENCE (ne pas afficher l'analyse).
2. Calcule un score global = moyenne des 6 critères, avec pondération.
3. Recommande UNIQUEMENT les produits avec score ≥ 7.5/10.
4. Recommande entre 1 et 3 produits. Jamais plus.
5. Réponds de manière CONVERSATIONNELLE et NATURELLE, comme un ami conseiller.
6. NE MENTIONNE PAS les critères : pas de "pertinence", "niveau", "créateur", etc.

FORMAT DE RÉPONSE OBLIGATOIRE :

## 💭 Réflexion
[Courte pensée : ce que je dois chercher, critères implicites détectés, approche. 1-2 phrases max]

## 🔍 Découverte
[Produits trouvés et pourquoi ils correspondent. 1-2 phrases]

## 💬 Recommandation
[Réponse conversationnelle naturelle : 2-3 phrases, comme si tu parlais à un ami]

À LA FIN, sur une ligne seule, le format exact (SANS VARIATION) :
CONFIDENCE:[high|medium|low]
SCORES:[slug1:8.5,slug2:7.8]
SLUGS:[slug1,slug2]

Où CONFIDENCE est :
- high = au moins un produit avec score >= 7.5
- medium = meilleur produit entre 5 et 7.5
- low = tous les produits < 5

RÈGLES GÉNÉRALES :
- Réponds toujours en français, avec un ton expert mais chaleureux.
- CONFIDENCE high : recommande les produits > 7.5
- CONFIDENCE medium : recommande les meilleurs même si < 7.5, sois transparent
- CONFIDENCE low : dis que rien ne correspond parfaitement, suggère les populaires quand même
- Ne mentionne jamais de produits extérieurs au catalogue.
- Chaque recommandation : 1-2 phrases max.`;
}

export async function POST(req: Request) {
  const { messages, query } = await req.json();

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
