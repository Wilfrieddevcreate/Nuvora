"use server";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export type ScrapeResult = {
  title?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  tags?: string[];
  price?: number;
  isFree?: boolean;
  language?: string;
  platform?: string;
  error?: string;
};

function stripHtml(html: string): string {
  // Supprime scripts, styles, balises, entités HTML — garde le texte brut
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function scrapeProduct(url: string): Promise<ScrapeResult> {
  // Validation URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return { error: "URL invalide." };
    }
    // Bloquer les URLs internes/privées
    const host = parsedUrl.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.") || host.startsWith("10.")) {
      return { error: "URL non autorisée." };
    }
  } catch {
    return { error: "URL invalide." };
  }

  // Fetch la page
  let html: string;
  try {
    const res = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NuvoraBot/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { error: `La page est inaccessible (${res.status}).` };
    html = await res.text();
  } catch {
    return { error: "Impossible de récupérer la page. Vérifiez l'URL." };
  }

  // Extraire le texte brut et tronquer à 4000 chars pour ne pas exploser les tokens
  const text = stripHtml(html).slice(0, 4000);

  const prompt = `Voici le contenu textuel d'une page de vente d'un produit numérique :

---
${text}
---

Extrais les informations suivantes et réponds UNIQUEMENT avec un objet JSON valide, sans markdown ni explication :
{
  "title": "titre du produit (string, max 80 chars)",
  "description": "description courte et vendeuse du produit (string, max 500 chars, en français si possible)",
  "category": "une seule valeur parmi : Formation, Ebook, Template, Logiciel",
  "subCategory": "sous-catégorie adaptée parmi : IA, Dev, Design, Marketing, Business, Finance, Productivité, Notion, Figma, Framer, Excel, SaaS, Plugin, Extension, Autre",
  "tags": ["array", "de", "3", "à", "6", "tags", "pertinents", "en", "minuscules"],
  "price": 0,
  "isFree": false,
  "language": "Français ou Anglais selon la langue du produit"
}

Si une information est introuvable, utilise null pour ce champ. Ne devine pas le prix si absent.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const data = JSON.parse(raw) as Record<string, unknown>;

    return {
      title: typeof data.title === "string" ? data.title : undefined,
      description: typeof data.description === "string" ? data.description : undefined,
      category: ["Formation", "Ebook", "Template", "Logiciel"].includes(data.category as string)
        ? (data.category as string)
        : undefined,
      subCategory: typeof data.subCategory === "string" ? data.subCategory : undefined,
      tags: Array.isArray(data.tags) ? (data.tags as string[]).slice(0, 6) : undefined,
      price: typeof data.price === "number" ? data.price : undefined,
      isFree: typeof data.isFree === "boolean" ? data.isFree : undefined,
      language: data.language === "Français" || data.language === "Anglais" ? (data.language as string) : undefined,
    };
  } catch {
    return { error: "L'analyse IA a échoué. Remplissez les champs manuellement." };
  }
}
