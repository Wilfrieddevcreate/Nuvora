"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SparkleIcon, SearchIcon, ArrowUpRight } from "@/components/icons";
import type { DbProduct } from "@/components/product-card";

const SUGGESTIONS = [
  "Quel est le meilleur ebook business ?",
  "Je cherche une formation React en français",
  "Quelle formation IA choisir ?",
  "Un template Notion pour créateurs",
];

const COVER_GRADIENT: Record<DbProduct["category"], string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};


type Chip = { label: string; query: string };

type AssistantMessage = {
  id: number;
  role: "assistant";
  text: string;
  reflection: string;
  discovery: string;
  recommendation: string;
  slugs: string[];
  chips: Chip[];
  confidence: "high" | "medium" | "low";
  done: boolean;
};

type Message = { id: number; role: "user"; text: string } | AssistantMessage;

const EMPTY_ASSISTANT = {
  text: "",
  reflection: "",
  discovery: "",
  recommendation: "",
  slugs: [] as string[],
  chips: [] as Chip[],
  confidence: "low" as const,
};

let counter = 0;
const nextId = () => ++counter;

function parseResponse(raw: string): {
  text: string;
  reflection: string;
  discovery: string;
  recommendation: string;
  slugs: string[];
  confidence: "high" | "medium" | "low";
} {
  const confidenceMatch = raw.match(/CONFIDENCE:\[(high|medium|low)\]/i);
  const slugsMatch = raw.match(/SLUGS:\s*\[?([a-z0-9,\- ]+)\]?/i);

  const confidence = (confidenceMatch?.[1]?.toLowerCase() as "high" | "medium" | "low") || "low";

  const slugs = [];
  if (slugsMatch) {
    const rawSlugs = slugsMatch[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    slugs.push(...rawSlugs);
  }

  // Extraire les sections
  const reflectionMatch = raw.match(/##\s*💭\s*Réflexion\n([\s\S]*?)(?=##|CONFIDENCE|\s*$)/i);
  const discoveryMatch = raw.match(/##\s*🔍\s*Découverte\n([\s\S]*?)(?=##|CONFIDENCE|\s*$)/i);
  const recommendationMatch = raw.match(/##\s*💬\s*Recommandation\n([\s\S]*?)(?=##|CONFIDENCE|\s*$)/i);

  const reflection = reflectionMatch?.[1]?.trim() || "";
  const discovery = discoveryMatch?.[1]?.trim() || "";
  const recommendation = recommendationMatch?.[1]?.trim() || "";

  const text = raw
    .replace(/##\s*💭\s*Réflexion[\s\S]*?(?=##|CONFIDENCE|\s*$)/i, "")
    .replace(/##\s*🔍\s*Découverte[\s\S]*?(?=##|CONFIDENCE|\s*$)/i, "")
    .replace(/##\s*💬\s*Recommandation[\s\S]*?(?=##|CONFIDENCE|\s*$)/i, "")
    .replace(/CONFIDENCE:\[(high|medium|low)\]/i, "")
    .replace(/SCORES:\[[^\]]+\]/i, "")
    .replace(/SLUGS:\s*\[?[a-z0-9,\- ]+\]?/i, "")
    .trim();

  return { text, reflection, discovery, recommendation, slugs, confidence };
}

function ProductPick({ product, rank }: { product: DbProduct; rank: number }) {
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-soft-lg"
    >
      {/* Miniature colorée */}
      <div
        className={`relative flex w-20 shrink-0 items-center justify-center bg-linear-to-br ${COVER_GRADIENT[product.category]}`}
      >
        <span className="text-2xl font-extrabold text-fg/15">
          {product.title.charAt(0)}
        </span>
        <span className="absolute bottom-1.5 left-1.5 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">
          {rank}
        </span>
      </div>

      {/* Contenu */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div>
          <div className="text-[11px] font-medium text-muted">
            {product.category} · {product.subCategory}
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <span className="truncate text-sm font-bold leading-snug text-fg group-hover:text-accent">
              {product.title}
            </span>
            <ArrowUpRight className="size-3.5 shrink-0 text-muted transition-smooth group-hover:text-accent" />
          </div>
          <div className="mt-0.5 text-[12px] text-muted">
            par {product.creatorName}
          </div>
        </div>

        <div className="mt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-fg">
              {(product.isFree ?? false) || product.price === 0 ? "Gratuit" : `${product.price} €`}
            </span>
            {product.creatorVerified && (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                ✓ Vérifié
              </span>
            )}
            {product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000 && (
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
                Nouveau
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AssistantChat({ products }: { products: DbProduct[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reducedRef.current ? "auto" : "smooth",
    });
  }, [messages, thinking]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;

    const userMsg: Message = { id: nextId(), role: "user", text: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    const history = messages;
    const assistantId = nextId();

    const patch = (fields: Partial<AssistantMessage>) =>
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId && msg.role === "assistant"
            ? { ...msg, ...fields }
            : msg,
        ),
      );

    setMessages((m) => [
      ...m,
      { id: assistantId, role: "assistant", ...EMPTY_ASSISTANT, done: false },
    ]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, query: q }),
      });

      if (!res.ok || !res.body) throw new Error("Erreur API");

      // Réponse écrite à la main (salutation, remerciement…) : pas de streaming.
      if (res.headers.get("content-type")?.includes("application/json")) {
        const canned: { text: string; chips?: Chip[] } = await res.json();
        patch({ text: canned.text, chips: canned.chips ?? [], done: true });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        patch(parseResponse(accumulated));
      }

      patch({ ...parseResponse(accumulated), done: true });
    } catch {
      patch({
        ...EMPTY_ASSISTANT,
        text: "Une erreur est survenue. Vérifiez votre connexion et réessayez.",
        done: true,
      });
    } finally {
      setThinking(false);
    }
  }

  function reset() {
    setMessages([]);
    setInput("");
  }

  const isEmpty = messages.length === 0;
  const lastMessage = messages[messages.length - 1];
  const showSuggestions =
    !thinking && lastMessage?.role === "assistant" && lastMessage.slugs.length > 0;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-5 sm:px-8">
      {/* Zone messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide py-8">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
              <SparkleIcon className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">
              Que cherchez-vous aujourd'hui ?
            </h1>
            <p className="mt-2 max-w-md text-fg-2">
              Décrivez votre besoin en langage naturel. L'assistant compare les
              produits de Nuvora et vous explique lesquels choisir.
            </p>
            <div className="mt-8 grid w-full max-w-lg gap-2.5 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm font-medium text-fg-2 transition-smooth hover:border-accent hover:text-fg"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-[15px] text-accent-fg">
                    {msg.text}
                  </p>
                </div>
              ) : (
                <div key={msg.id} className="flex gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <SparkleIcon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    {/* Réflexion */}
                    {msg.reflection && (
                      <div className="rounded-lg border border-border/50 bg-surface-2/50 p-3">
                        <p className="text-[13px] leading-relaxed text-fg-2">
                          <span className="text-[12px] font-medium text-muted">💭 Réflexion — </span>
                          {msg.reflection}
                        </p>
                      </div>
                    )}

                    {/* Découverte */}
                    {msg.discovery && (
                      <div className="rounded-lg border border-border/50 bg-surface-2/50 p-3">
                        <p className="text-[13px] leading-relaxed text-fg-2">
                          <span className="text-[12px] font-medium text-muted">🔍 Découverte — </span>
                          {msg.discovery}
                        </p>
                      </div>
                    )}

                    {/* Réponse */}
                    {(msg.recommendation || msg.text) && (
                      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-fg-2">
                        {msg.recommendation || msg.text}
                      </p>
                    )}

                    {/* Bandeau d'avertissement pour confiance medium */}
                    {msg.confidence === "medium" && msg.slugs.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path d="M12 2v20m10-10H2" />
                        </svg>
                        <p className="text-[13px] font-medium text-amber-700 dark:text-amber-300">
                          Meilleure correspondance disponible, mais votre besoin est assez spécifique.
                        </p>
                      </div>
                    )}

                    {/* Cartes produits (confiance high ou medium) */}
                    {msg.slugs.length > 0 && (
                      <div className="mt-3 space-y-2.5">
                        {msg.slugs.map((slug, i) => {
                          const product = products.find((p) => p.slug === slug);
                          if (!product) return null;
                          return (
                            <ProductPick
                              key={`recommended-${slug}`}
                              product={product}
                              rank={i + 1}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Puces cliquables proposées avec la réponse */}
                    {msg.done && msg.chips.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.chips.map((chip) => (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => ask(chip.query)}
                            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-medium text-fg-2 transition-smooth hover:border-accent hover:text-fg"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}

            {/* Suggestions de suivi */}
            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pl-11">
                {SUGGESTIONS.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-medium text-fg-2 transition-smooth hover:border-accent hover:text-fg"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {thinking && (
              <div className="flex gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <SparkleIcon className="size-4" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3">
                  <Dot delay="0ms" />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Champ de saisie */}
      <div className="border-t border-border py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-2 pl-4 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent-soft"
        >
          <SearchIcon className="size-5 shrink-0 text-muted" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question…"
            aria-label="Poser une question à l'assistant"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-2"
          />
          {!isEmpty && (
            <button
              type="button"
              onClick={reset}
              className="shrink-0 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-smooth hover:bg-surface-2 hover:text-fg"
            >
              Nouvelle conv.
            </button>
          )}
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="shrink-0 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-smooth hover:bg-accent-hover disabled:opacity-40"
          >
            Envoyer
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-muted">
          Assistant Nuvora · Les recommandations sont basées sur le catalogue.
        </p>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-2 animate-bounce rounded-full bg-muted motion-reduce:animate-none"
      style={{ animationDelay: delay }}
    />
  );
}
