"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SparkleIcon, SearchIcon, ArrowUpRight } from "@/components/icons";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/data/products";

const SUGGESTIONS = [
  "Quel est le meilleur ebook business ?",
  "Je cherche une formation React en français",
  "Quelle formation IA choisir ?",
  "Un template Notion pour créateurs",
];

const COVER_GRADIENT: Record<Product["category"], string> = {
  Formation: "from-indigo-100 to-violet-50 dark:from-indigo-500/20 dark:to-violet-500/10",
  Ebook: "from-sky-100 to-cyan-50 dark:from-sky-500/20 dark:to-cyan-500/10",
  Template: "from-amber-100 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/10",
  Logiciel: "from-emerald-100 to-teal-50 dark:from-emerald-500/20 dark:to-teal-500/10",
};


type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; text: string; slugs: string[] };

let counter = 0;
const nextId = () => ++counter;

function parseSlugs(raw: string): { text: string; slugs: string[] } {
  const match = raw.match(/SLUGS:\s*\[?([a-z0-9,\- ]+)\]?/i);
  if (!match) return { text: raw.trim(), slugs: [] };
  const slugs = match[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const text = raw.replace(/SLUGS:\s*\[?[a-z0-9,\- ]+\]?/i, "").trim();
  return { text, slugs };
}

function ProductPick({ product, rank }: { product: Product; rank: number }) {
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
            <ArrowUpRight className="size-3.5 shrink-0 text-muted transition-colors group-hover:text-accent" />
          </div>
          <div className="mt-0.5 text-[12px] text-muted">
            par {product.creator}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-extrabold text-fg">
            {product.price === 0 ? "Gratuit" : `${product.price} €`}
          </span>
          {product.verified && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
              ✓ Vérifié
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
              Nouveau
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function AssistantChat() {
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

    setMessages((m) => [
      ...m,
      { id: assistantId, role: "assistant", text: "", slugs: [] },
    ]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, query: q }),
      });

      if (!res.ok || !res.body) throw new Error("Erreur API");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const { text, slugs } = parseSlugs(accumulated);
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId && msg.role === "assistant"
              ? { ...msg, text, slugs }
              : msg,
          ),
        );
      }

      const { text, slugs } = parseSlugs(accumulated);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId && msg.role === "assistant"
            ? { ...msg, text, slugs }
            : msg,
        ),
      );
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId && msg.role === "assistant"
            ? {
                ...msg,
                text: "Une erreur est survenue. Vérifiez votre connexion et réessayez.",
                slugs: [],
              }
            : msg,
        ),
      );
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
    !thinking &&
    lastMessage?.role === "assistant" &&
    (lastMessage as Extract<Message, { role: "assistant" }>).slugs.length > 0;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-5 sm:px-8">
      {/* Zone messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-8">
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
                  className="rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm font-medium text-fg-2 transition-colors hover:border-accent hover:text-fg"
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
                  <div className="min-w-0 flex-1">
                    {msg.text && (
                      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-fg-2">
                        {msg.text}
                      </p>
                    )}
                    {msg.slugs.length > 0 && (
                      <div className="mt-3 space-y-2.5">
                        {msg.slugs.map((slug, i) => {
                          const product = PRODUCTS.find((p) => p.slug === slug);
                          if (!product) return null;
                          return (
                            <ProductPick
                              key={slug}
                              product={product}
                              rank={i + 1}
                            />
                          );
                        })}
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
                    className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-medium text-fg-2 transition-colors hover:border-accent hover:text-fg"
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
            className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
          />
          {!isEmpty && (
            <button
              type="button"
              onClick={reset}
              className="shrink-0 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              Nouvelle conv.
            </button>
          )}
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="shrink-0 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-40"
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
