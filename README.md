# Nuvora — Marketplace de produits digitaux

Nuvora est une marketplace de référencement de produits numériques (formations, ebooks, templates, logiciels). Les créateurs listent leurs produits, les acheteurs les découvrent via la recherche, les filtres ou l'assistant IA. Nuvora ne traite aucun paiement — elle redirige vers la plateforme du créateur.

---

## Stack

| Couche | Technologie |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| UI | React 19 |
| Style | Tailwind CSS v4 (design system maison) |
| Base de données | SQLite via Prisma 7 + `@prisma/adapter-libsql` |
| Auth | Sessions JWT (jose, HS256) + Google OAuth (arctic v3, PKCE) |
| LLM | Groq SDK — `llama-3.1-8b-instant` |
| Rich text | Tiptap (StarterKit + Link) + sanitize-html côté serveur |
| Langage | TypeScript |

---

## Démarrage

```bash
npm install
```

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="une-chaine-aleatoire-de-32-caracteres-minimum"

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# Groq (console.groq.com — gratuit)
GROQ_API_KEY="gsk_..."
```

Appliquer les migrations et peupler la base :

```bash
npx prisma migrate deploy
npm run seed
```

Lancer le serveur :

```bash
npm run dev
```

L'app tourne sur [http://localhost:3000](http://localhost:3000).

**Compte admin seed :** `admin@nuvora.app` / `admin1234`

---

## Routes

### Public `(main)` — avec TopBar + Footer

| URL | Description |
| --- | --- |
| `/` | Accueil (hero, nouveautés, populaires, teaser assistant) |
| `/catalogue` | Catalogue filtrable (catégorie, prix, langue, plateforme) |
| `/catalogue/[categorie]` | Vue par catégorie |
| `/produit/[slug]` | Fiche produit détaillée + avis + produits similaires |
| `/createur` | Page marketing "Vendre sur Nuvora" |
| `/createur/[slug]` | Profil public d'un créateur + ses produits |
| `/assistant` | Assistant IA — recommandation en langage naturel |
| `/recherche` | Résultats de recherche (`?q=`) |
| `/compte` | Favoris, historique, paramètres (utilisateur connecté) |
| `/cgu` · `/confidentialite` · `/mentions-legales` | Pages légales |

### Auth `(auth)` — layout plein écran

| URL | Description |
| --- | --- |
| `/connexion` | Connexion email/mot de passe ou Google |
| `/inscription` | Création de compte |
| `/onboarding` | Étapes post-inscription (displayName, plateforme, spécialité) |
| `/api/auth/google` | Initiation OAuth Google (PKCE) |
| `/api/auth/google/callback` | Callback OAuth — crée ou lie le compte |

### Dashboard `(dashboard)` — espace créateur (rôle `creator`)

| URL | Description |
| --- | --- |
| `/dashboard` | Vue d'ensemble (stats réelles depuis la DB) |
| `/dashboard/produits` | Liste des produits du créateur |
| `/dashboard/produits/nouveau` | Soumettre un nouveau produit (wizard 3 étapes) |
| `/dashboard/produits/[slug]` | Modifier un produit (repassé en validation) |
| `/dashboard/statistiques` | Statistiques détaillées |
| `/dashboard/profil` | Édition du profil (nom, bio rich text, spécialité, accroche) |

### Admin `(admin)` — backoffice (rôle `admin`)

| URL | Description |
| --- | --- |
| `/admin` | Vue d'ensemble : KPIs, produits en attente, activité récente |
| `/admin/produits` | Valider / rejeter les soumissions |
| `/admin/createurs` | Liste des créateurs, vérification en un clic |
| `/admin/avis` | Modération des avis |
| `/admin/parametres` | Paramètres de la plateforme |

### API

| Méthode | URL | Description |
| --- | --- | --- |
| `POST` | `/api/assistant` | Streaming LLM — catalogue DB injecté dans le prompt, réponse token par token |
| `GET` | `/api/auth/google` | Initiation OAuth |
| `GET` | `/api/auth/google/callback` | Callback OAuth |

---

## Structure du projet

```text
src/
├── app/
│   ├── (auth)/           # Connexion, inscription, onboarding, OAuth
│   ├── (main)/           # Pages publiques
│   ├── (dashboard)/      # Espace créateur (role: creator)
│   ├── (admin)/          # Backoffice (role: admin)
│   ├── actions/          # Server Actions (auth, products, creator, admin, onboarding)
│   └── api/              # Routes API (assistant streaming, OAuth)
├── components/
│   ├── ui/               # Button, Select — composants de base
│   └── *.tsx             # ProductCard, CatalogView, AssistantChat, RichTextEditor…
├── contexts/
│   ├── auth.tsx          # AuthProvider + useAuth (session côté client)
│   ├── favorites.tsx     # FavoritesProvider + useFavorites (localStorage)
│   └── toast.tsx         # ToastProvider + useToast
├── lib/
│   ├── dal.ts            # verifySession, getCurrentUser (React.cache)
│   ├── db.ts             # Singleton Prisma (libsql adapter)
│   ├── session.ts        # createSession, deleteSession (JWT + cookie httpOnly)
│   └── google-oauth.ts   # Singleton arctic Google
├── data/
│   └── products.ts       # Constantes statiques (CATEGORIES, PLATFORMS, SORTS…) + helpers mock homepage
└── proxy.ts              # Middleware edge — protection des routes + headers sécurité
prisma/
├── schema.prisma         # Modèles User, Creator, Product, Review
├── seed.ts               # Seed : 1 admin, 8 créateurs, 25 produits actifs
└── migrations/           # Migrations Prisma
```

---

## Authentification

- **Email/mot de passe** : bcrypt cost 12, hash constant-time, DUMMY_HASH anti-timing
- **Google OAuth** : arctic v3 PKCE — state + codeVerifier en cookies httpOnly (10 min), fusion de compte par email si déjà existant
- **Session** : JWT HS256 signé avec `SESSION_SECRET`, stocké en cookie httpOnly SameSite=Lax, 30 jours
- **DAL** : `verifySession()` et `getCurrentUser()` mémoïsés par `React.cache()` — un seul aller DB par requête
- **Middleware** (`proxy.ts`) : protection edge des routes par rôle (`buyer` → onboarding, `creator` → dashboard, `admin` → admin), headers CSP/HSTS

---

## Modèle de données

```text
User          → Creator (1:1, optionnel)
Creator       → Product[] (1:N)
User          → Review[] (1:N)
Product       → Review[] (1:N)
```

**Statuts produit :** `pending` (soumis, en attente) → `active` (validé, visible) ou `rejected`

**Rôles utilisateur :** `buyer` (défaut) → `creator` (après onboarding) ou `admin`

---

## Assistant IA

1. La page `/assistant` charge les produits `active` depuis la DB (Server Component) et les passe au composant client.
2. À chaque question, `POST /api/assistant` recharge le catalogue DB à jour et l'injecte dans le system prompt Groq.
3. Le modèle répond en texte libre et termine avec `SLUGS:[slug1,slug2]`.
4. Le client lit le stream token par token, parse la ligne `SLUGS:` et affiche les cartes produits correspondantes.
5. L'historique complet est renvoyé à chaque requête — la conversation multi-tours fonctionne.

---

## Design system

Tokens définis dans `src/app/globals.css`, exposés comme classes Tailwind via `@theme inline`.

| Token | Rôle |
| --- | --- |
| `bg` / `surface` / `surface-2` | Fonds de page et de cartes |
| `fg` / `fg-2` / `muted` | Hiérarchie de texte |
| `border` / `border-2` | Bordures |
| `accent` / `accent-hover` / `accent-soft` | Indigo — action primaire |
| `success` / `warning` / `danger` | États sémantiques |

Le thème sombre est activé via la classe `.dark` sur `<html>` (bouton `ThemeToggle` dans la TopBar).

---

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint
npm run seed     # Seed la base de données (wipe + recréation)
```
