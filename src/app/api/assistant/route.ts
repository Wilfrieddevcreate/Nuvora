import Groq from "groq-sdk";
import { PRODUCTS } from "@/data/products";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CATALOGUE = PRODUCTS.map(
  (p) =>
    `- slug:"${p.slug}" | "${p.title}" | ${p.category} ${p.subCategory} | ${p.price === 0 ? "gratuit" : `${p.price}€`} | tags: ${p.tags.join(", ")}`,
).join("\n");

const SYSTEM_PROMPT = `Tu es l'assistant de Nuvora, une marketplace de produits numériques (formations, ebooks, templates).
Ton rôle : comprendre le besoin de l'utilisateur en langage naturel et recommander les produits les plus adaptés du catalogue.

CATALOGUE NUVORA :
${CATALOGUE}

RÈGLES :
1. Réponds toujours en français, avec un ton expert mais chaleureux.
2. Commence par une courte phrase d'analyse du besoin (1-2 phrases max).
3. Recommande entre 1 et 3 produits du catalogue. Jamais plus.
4. Pour chaque produit recommandé, explique EN UNE PHRASE COURTE pourquoi il correspond à ce besoin précis.
5. À la toute fin de ta réponse, sur une ligne seule, OBLIGATOIRE, écris exactement ce format sans variation : SLUGS:[slug1,slug2] — remplace slug1/slug2 par les vrais slugs. Exemple : SLUGS:[lancer-son-offre-30-jours,os-createur-notion]. Jamais d'espace, jamais de guillemets, toujours les crochets.
6. Si aucun produit ne correspond vraiment, dis-le honnêtement et suggère les plus populaires en l'indiquant.
7. Ne mentionne jamais de produits extérieurs au catalogue.`;

export async function POST(req: Request) {
  const { messages, query } = await req.json();

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
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: query },
    ],
    max_tokens: 600,
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
