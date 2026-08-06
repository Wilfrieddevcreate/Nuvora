"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectProps<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  label?: string; // libellé court affiché avant la valeur (ex. "Trier")
  ariaLabel?: string;
  className?: string;
};

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0 text-muted"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * Select custom cohérent avec la charte Nuvora (arrondi, indigo, ombres douces).
 * Remplace le <select> natif : accessible clavier + ARIA, ferme au clic
 * extérieur et à Échap. À réutiliser partout (tri, formulaire produit…).
 */
export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  ariaLabel,
  className = "",
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === value)),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function choose(index: number) {
    const opt = options[index];
    if (opt) {
      onChange(opt.value);
      setActiveIndex(index);
    }
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(activeIndex);
        else setOpen(true);
        break;
      case "Escape":
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className="flex w-full items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm transition-smooth hover:border-border-2 active:scale-95 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
      >
        {label && <span className="text-muted">{label}</span>}
        <span className="flex-1 truncate text-left font-medium text-fg">
          {selected?.label}
        </span>
        <ChevronDown />
      </button>

      {open && (
        <ul
          role="listbox"
          id={listId}
          tabIndex={-1}
          className="absolute right-0 z-50 mt-2 max-h-72 min-w-full overflow-auto rounded-xl border border-border bg-surface p-1.5 shadow-soft-lg"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => choose(i)}
                className={
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-smooth " +
                  (isActive ? "bg-accent-soft text-accent" : "text-fg-2 hover:bg-surface-2")
                }
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 shrink-0 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
