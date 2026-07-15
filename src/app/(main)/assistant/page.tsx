import type { Metadata } from "next";
import { AssistantChat } from "@/components/assistant-chat";

export const metadata: Metadata = {
  title: "Assistant IA — Nuvora",
  description:
    "Décrivez ce que vous cherchez : l’assistant Nuvora compare les produits digitaux et vous recommande les meilleurs.",
};

export default function AssistantPage() {
  return <AssistantChat />;
}
