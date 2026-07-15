import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Sans-serif douce et moderne — casse normale, très lisible
const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Données, prix, métadonnées ponctuelles
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nuvora.app"),
  title: {
    default: "Nuvora — Trouvez les meilleurs produits digitaux",
    template: "%s — Nuvora",
  },
  description:
    "Nuvora est le moteur de découverte des produits digitaux : ebooks, formations, templates et logiciels. On vous aide à trouver, on vous redirige vers l'achat chez le créateur.",
  keywords: [
    "produits digitaux",
    "ebooks",
    "formations en ligne",
    "templates",
    "logiciels",
    "marketplace digital",
    "créateurs",
  ],
  authors: [{ name: "Nuvora" }],
  creator: "Nuvora",
  openGraph: {
    siteName: "Nuvora",
    locale: "fr_FR",
    type: "website",
    title: "Nuvora — Trouvez les meilleurs produits digitaux",
    description:
      "Moteur de découverte de produits digitaux : ebooks, formations, templates, logiciels. Nuvora vous oriente, l'achat se fait chez le créateur.",
    url: "https://nuvora.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuvora — Trouvez les meilleurs produits digitaux",
    description:
      "Moteur de découverte de produits digitaux : ebooks, formations, templates, logiciels. Nuvora vous oriente, l'achat se fait chez le créateur.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://nuvora.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-bg text-fg font-sans">
        {children}
      </body>
    </html>
  );
}
