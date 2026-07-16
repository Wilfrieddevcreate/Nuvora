"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CreatorProduct = {
  slug: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  tags: string[];
  price: number;
  isFree: boolean;
  language: string;
  country: string;
  platform: string;
  purchaseUrl: string;
  status: "pending" | "active" | "rejected";
  submittedAt: string;
  views: number;
  clicks: number;
};

interface CreatorProductsCtx {
  products: CreatorProduct[];
  addProduct: (data: Omit<CreatorProduct, "slug" | "status" | "submittedAt" | "views" | "clicks">) => CreatorProduct;
  removeProduct: (slug: string) => void;
  updateProduct: (slug: string, data: Partial<CreatorProduct>) => void;
  getProduct: (slug: string) => CreatorProduct | undefined;
}

const Ctx = createContext<CreatorProductsCtx>({
  products: [],
  addProduct: () => { throw new Error("CreatorProductsProvider missing"); },
  removeProduct: () => {},
  updateProduct: () => {},
  getProduct: () => undefined,
});

export function CreatorProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<CreatorProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nuvora_creator_products");
      if (stored) setProducts(JSON.parse(stored));
    } catch {}
  }, []);

  function addProduct(data: Omit<CreatorProduct, "slug" | "status" | "submittedAt" | "views" | "clicks">): CreatorProduct {
    const slug =
      data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" +
      Date.now();
    const product: CreatorProduct = {
      ...data,
      slug,
      status: "pending",
      submittedAt: new Date().toISOString(),
      views: 0,
      clicks: 0,
    };
    setProducts((prev) => {
      const next = [...prev, product];
      try { localStorage.setItem("nuvora_creator_products", JSON.stringify(next)); } catch {}
      return next;
    });
    return product;
  }

  function removeProduct(slug: string) {
    setProducts((prev) => {
      const next = prev.filter((p) => p.slug !== slug);
      try { localStorage.setItem("nuvora_creator_products", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function updateProduct(slug: string, data: Partial<CreatorProduct>) {
    setProducts((prev) => {
      const next = prev.map((p) => (p.slug === slug ? { ...p, ...data } : p));
      try { localStorage.setItem("nuvora_creator_products", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function getProduct(slug: string) {
    return products.find((p) => p.slug === slug);
  }

  return (
    <Ctx.Provider value={{ products, addProduct, removeProduct, updateProduct, getProduct }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCreatorProducts() {
  return useContext(Ctx);
}
