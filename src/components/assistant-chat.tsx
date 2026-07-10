"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SparkleIcon, SearchIcon, ArrowUpRight } from "@/components/icons";
import { recommendProducts, type Recommendation } from "@/data/products";

const SUGGESTIONS = [
  "Quel est le meilleur ebook business ?",
  "Je cherche une formation React en français",
  "Quelle formation IA choisir ?",
  "Un template Notion pour créateurs",
];

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; text: string; picks: Recommendation[] };

// Réponse d'intro mockée selon les résultats.
function introText(count: number): string {
  if (count === 0) {
    return "Je n’ai pas trouvé de correspondance exacte, mais voici des produits populaires qui pourraient vous intéresser :";
  }
  return `J’ai comparé le catalogue et sélectionné ${count} produits. Voici pourquoi chacun correspond à votre demande :`;
}

let counter = 0;
const nextId = () => ++counter;

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

  // auto-scroll vers le bas quand un message arrive
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reducedRef.current ? "auto" : "smooth",
    });
  }, [messages, thinking]);

  function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;

    setMessages((m) => [...m, { id: nextId(), role: "user", text: q }]);
    setInput("");
    setThinking(true);

    const delay = reducedRef.current ? 0 : 900;
    window.setTimeout(() => {
      const picks = recommendProducts(q, 3);
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "assistant",
          text: introText(picks.length),
          picks,
        },
      ]);
      setThinking(false);
    }, delay);
  }

  const isEmpty = messages.length === 0;

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
              Que cherchez-vous aujourd’hui ?
            </h1>
            <p className="mt-2 max-w-md text-fg-2">
              Décrivez votre besoin en langage naturel. L’assistant compare les
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
                    <p className="text-[15px] text-fg-2">{msg.text}</p>
                    <div className="mt-3 space-y-2.5">
                      {msg.picks.map((rec, i) => (
                        <Link
                          key={rec.product.slug}
                          href={`/produit/${rec.product.slug}`}
                          className="group flex gap-3 rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-accent"
                        >
                          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-bold">
                                {rec.product.title}
                              </span>
                              <ArrowUpRight className="size-3.5 shrink-0 text-muted transition-colors group-hover:text-accent" />
                            </span>
                            {/* Justification : POURQUOI ce produit */}
                            <span className="mt-1 block text-[13px] leading-snug text-fg-2">
                              {rec.reason}
                            </span>
                            {/* Specs secondaires */}
                            <span className="mt-1.5 block text-[11px] text-muted">
                              {rec.meta}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ),
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
            aria-label="Poser une question à l’assistant"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="shrink-0 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            Envoyer
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-muted">
          Maquette : les recommandations sont générées à partir du catalogue
          Nuvora.
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
