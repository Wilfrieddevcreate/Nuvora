# Nuvora — Marketplace de produits digitaux

Nuvora est une marketplace de référencement de produits numériques (formations, ebooks, templates, logiciels). Les créateurs listent leurs produits, les acheteurs les découvrent via la recherche, les filtres ou l'assistant IA.

---

## Stack

| Couche | Technologie |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Style | Tailwind CSS v4 (design system maison, zero dependance UI) |
| LLM | Groq SDK — `llama-3.1-8b-instant` |
| Langage | TypeScript |

---

## Demarrage

```bash
npm install
```

Cree un fichier `.env.local` a la racine :

```env
GROQ_API_KEY=gsk_...
```

Cle gratuite sur [console.groq.com](https://console.groq.com) (sans carte bancaire).

```bash
npm run dev
```

L'app tourne sur [http://localhost:3000](http://localhost:3000).

---

## Routes

### Public `(main)` — avec TopBar + Footer

| URL | Description |
| --- | --- |
| `/` | Accueil (hero, nouveautes, populaires, teaser assistant) |
| `/catalogue` | Catalogue filtrable (categorie, prix, langue, plateforme) |
| `/produit/[slug]` | Fiche produit detaillee |
| `/createur` | Page marketing "Vendre sur Nuvora" |
| `/createur/[slug]` | Profil public d'un createur |
| `/assistant` | Assistant IA (chat en langage naturel) |
| `/recherche` | Resultats de recherche (`?q=`) |
| `/compte` | Favoris, historique, parametres du compte |
| `/cgu` · `/confidentialite` · `/mentions-legales` | Pages legales |

### Auth `(auth)` — layout plein ecran sans navigation

| URL | Description |
| --- | --- |
| `/connexion` | Formulaire de connexion |
| `/inscription` | Formulaire d'inscription |
| `/confirmation` | Confirmation du compte (OTP) |
| `/mot-de-passe-oublie` | Reinitialisation du mot de passe |

### Dashboard `(dashboard)` — espace createur

| URL | Description |
| --- | --- |
| `/dashboard` | Vue d'ensemble |
| `/dashboard/produits` | Liste des produits du createur |
| `/dashboard/produits/nouveau` | Ajouter un produit |
| `/dashboard/produits/[slug]` | Modifier un produit |
| `/dashboard/statistiques` | Statistiques detaillees |
| `/dashboard/profil` | Edition du profil createur |

### API

| Methode | URL | Description |
| --- | --- | --- |
| `POST` | `/api/assistant` | Streaming plain text — appel Groq avec historique |

---

## Structure du projet

```text
src/
├── app/
│   ├── (auth)/          # Pages d'authentification
│   ├── (main)/          # Pages publiques
│   ├── (dashboard)/     # Espace createur
│   └── api/assistant/   # Route API streaming
├── components/
│   ├── ui/              # Button, Select — composants de base
│   └── *.tsx            # ProductCard, AssistantChat, TopBar…
├── contexts/
│   ├── auth.tsx         # AuthProvider + useAuth
│   ├── favorites.tsx    # FavoritesProvider + useFavorites (localStorage)
│   └── toast.tsx        # ToastProvider + useToast
└── data/
    └── products.ts      # Donnees mockees + helpers (PRODUCTS, CREATORS, filterProducts…)
```

---

## Design system

Tokens definis dans `src/app/globals.css`, exposes comme classes Tailwind via `@theme inline`.

### Couleurs principales

| Token | Role |
| --- | --- |
| `bg` / `surface` / `surface-2` | Fonds de page et de cartes |
| `fg` / `fg-2` / `muted` | Hierarchie de texte |
| `border` / `border-2` | Bordures |
| `accent` / `accent-hover` / `accent-soft` | Indigo — action primaire |
| `success` / `warning` / `danger` | Etats semantiques |

Le theme sombre est active via la classe `.dark` sur `<html>` (bouton `ThemeToggle` dans la TopBar).

### Typographie

- **Sans-serif** : Plus Jakarta Sans (Google Fonts)
- **Mono** : JetBrains Mono (Google Fonts)

---

## Assistant IA

L'assistant est le point de differenciation de Nuvora. Il comprend les questions en langage naturel et recommande jusqu'a 3 produits du catalogue avec une justification.

**Fonctionnement :**

1. Le client envoie `POST /api/assistant` avec la question et l'historique de conversation.
2. La route injecte le catalogue complet dans le system prompt et appelle Groq en streaming.
3. Le modele repond en texte libre et termine avec `SLUGS:[slug1,slug2]`.
4. Le client lit le stream token par token, parse la ligne `SLUGS:` a la fin et affiche les cartes produits correspondantes.

**Conversation multi-tours :** l'historique complet est renvoye a chaque requete — le modele se souvient du contexte ("montre-moi quelque chose de moins cher" fonctionne).

**Migration vers abonnements :** remplacer Groq par Claude Haiku/Sonnet cote route API, ajouter un middleware qui verifie l'abonnement avant de laisser passer l'appel.

---

## Etat actuel des donnees

Tout est mocke en dur dans `src/data/products.ts` — aucune base de donnees, aucune API externe (sauf Groq).

| Donnee | Quantite |
| --- | --- |
| Produits | 9 |
| Createurs | 7 |
| Categories | Formation · Ebook · Template · Logiciel |

L'auth est simulee (un utilisateur mocke est connecte par defaut pour faciliter les tests UI). Le dashboard est cable sur le createur `studio-lumen` en dur.

---

## Scripts

```bash
npm run dev      # Serveur de developpement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint
```
