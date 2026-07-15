"use client";

import { useRef, useState } from "react";

/**
 * Saisie d'un code à 6 chiffres (OTP). Maquette front : aucune vérification
 * réelle. Gère le focus auto, le collage, et Retour arrière entre les cases.
 */
export function OtpInput({ length = 6 }: { length?: number }) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setAt(i: number, v: string) {
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1); // garde un seul chiffre
    setAt(i, digit);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length)
      .split("");
    if (digits.length === 0) return;
    const next = Array(length).fill("");
    digits.forEach((d, idx) => (next[idx] = d));
    setValues(next);
    refs.current[Math.min(digits.length, length - 1)]?.focus();
  }

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          aria-label={`Chiffre ${i + 1}`}
          className="h-14 w-full min-w-0 rounded-xl border border-border bg-surface text-center text-xl font-bold text-fg outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent-soft"
        />
      ))}
    </div>
  );
}
