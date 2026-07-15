import type { Metadata } from "next";
import { AssistantChat } from "@/components/assistant-chat";

export const metadata: Metadata = {
  title: "Assistant IA — Trouvez le produit digital qu’il vous faut",
  description:
    "Décrivez votre besoin en langage naturel : l’assistant Nuvora analyse les produits disponibles et vous recommande les mieux adaptés à votre situation.",
  keywords: [
    "assistant IA produits digitaux",
    "recommandation produit",
    "aide au choix ebook",
    "formation recommandée",
    "intelligence artificielle marketplace",
  ],
  openGraph: {
    title: "Assistant IA Nuvora — Trouvez le produit digital qu’il vous faut",
    description:
      "Décrivez votre besoin : l’assistant Nuvora vous recommande les meilleurs ebooks, formations et templates.",
    url: "https://nuvora.app/assistant",
    type: "website",
  },
  twitter: {
    title: "Assistant IA Nuvora",
    description:
      "Décrivez votre besoin, l’assistant vous recommande les meilleurs produits digitaux.",
  },
  alternates: { canonical: "https://nuvora.app/assistant" },
};

export default function AssistantPage() {
  return <AssistantChat />;
}
