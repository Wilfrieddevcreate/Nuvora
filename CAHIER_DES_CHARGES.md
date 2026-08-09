# Nuvora — Cahier des charges

## Vue d'ensemble

**Nuvora** est une marketplace moderne pour créateurs et apprenants. Elle permet de découvrir, acheter et vendre des produits numériques (formations, ebooks, templates, logiciels) avec un assistant IA qui comprend les vrais besoins avant de recommander.

### Pour les acheteurs

#### 🔴 Le problème
- **Paralysie du choix** : Des milliers de formations, ebooks, templates disponibles en ligne, impossible de savoir par où commencer
- **Fausses recommandations** : Les algorithmes classiques (populaires, tendances) ne correspondent pas à leurs besoins réels
- **Manque de contexte** : Difficile d'évaluer si un produit est adapté à son niveau, son budget, ses objectifs
- **Waste de temps et d'argent** : Beaucoup achètent des produits qui ne correspondent pas à ce qu'ils cherchent vraiment

#### 🟢 Notre solution : Assistant IA conversationnel intelligent
Nuvora propose un **assistant IA qui joue le rôle d'un vrai conseiller**:
1. **Écoute active** : Pose des questions précises pour comprendre le besoin réel (sujet, niveau, budget, format préféré)
2. **Matching intelligent** : Analyse 200+ produits selon 6 critères (pertinence, prix, niveau, créateur vérifié, popularité, alignement description)
3. **Recommandations hyper-ciblées** : Propose 1-3 produits qui correspondent VRAIMENT, pas une liste générique
4. **Conversation progressive** : Affine les recommandations au fur et à mesure de la discussion
5. **Transparence** : Explique pourquoi chaque produit est recommandé (la réflexion et découverte sont visibles)

**Résultat** : L'acheteur trouve le produit qui correspond à 80%+ de ses besoins en 2-3 messages, au lieu de passer 1h à chercher.

---

### Pour les créateurs

#### 🔴 Le problème
- **Invisibilité** : Des milliers de produits en ligne, difficile de se faire remarquer sans budget marketing énorme
- **Métriques pourries** : Les plateformes classiques sont remplies de bots et faux clics — les vrais chiffres sont impossibles à obtenir
- **Concentration du pouvoir** : Les gros créateurs dominent les listes "populaires", les débutants restent invisibles
- **Monétisation difficile** : Les plateformes prennent 30-50% de commission, contrôlent les prix, le design, tout
- **Manque de confiance** : Les clients se demandent si c'est vraiment le bon créateur, si le produit vaut vraiment le prix

#### 🟢 Notre solution : Marketplace IA-first avec vérification et transparence
Nuvora propose une plateforme où **les produits de qualité sont mis en avant par l'IA**, pas par le budget marketing:
1. **Système de vérification** : Les créateurs vérifient leur identité, construisent une réputation réelle (pas d'arnaque)
2. **Recommandation par l'IA** : L'algorithme recommande les produits basés sur 6 critères objectifs, pas sur les clics achetés
3. **Métriques fiables** : Détection automatique des bots et fraude → les vrais chiffres de vues/clics
4. **Contrôle complet** : Le créateur contrôle le prix, la description, la présentation. Nuvora n'interfère pas
5. **Commission raisonnable** : Moins que les concurrents, plus transparent
6. **Audience qualifiée** : Les clients qui arrivent via Nuvora savent exactement ce qu'ils achètent (grâce à l'assistant IA)

**Résultat** : Un créateur avec un produit de qualité a une vraie chance d'être découvert et vendu, même s'il est débutant. Les métriques de Nuvora deviennent LA preuve de qualité auprès des clients.

---

## Objectifs principaux

- **Assistant IA conversationnel** : Un conseiller intelligent qui pose des questions clarifiantes au lieu de proposer des produits par défaut
- **Matching précis** : Recommander les 1-3 produits qui correspondent vraiment aux besoins de l'utilisateur
- **Tracking anti-fraude** : Détecter les bots et activités suspectes pour des métriques fiables
- **Design polish** : Interface moderne, fluide, accessible avec animations subtiles
- **Multi-langue** : Catalogue ouvert à toutes les langues avec filtrage

---

## Fonctionnalités clés

### Assistant IA
- Conversation multi-tour avec contexte préservé
- Détection automatique de demandes vagues vs claires
- Stratégie intelligente : questions → recommandations
- Scoring sur 6 critères : pertinence, prix, niveau, créateur, popularité, alignement description
- Confidence levels : high (≥7.5), medium (5-7.5), low (<5)
- Streaming progressif avec affichage Réflexion → Découverte → Recommandation

### Marketplace
- Catalogue de produits par catégorie : Formation, Ebook, Template, Logiciel
- Recherche et filtrage multi-critères (langue, prix, niveau, créateur vérifié)
- Système d'avis et ratings (1-5 étoiles)
- Pages produit avec détails complets, créateur info, preuve sociale
- Panier et checkout simplifié (redirection vers URL achat externe)

### Tableau de bord créateur
- Gestion des produits (création, édition, suppression)
- Métriques : vues, clics, revenus estimés
- Notifications de nouvelles publications
- Profil de créateur avec vérification

### Tracking et Analytics
- Logging des vues et clics par produit
- Détection de bots (User-Agent analysis)
- Rate limiting (10 vues/h, 5 clics/h par IP/user)
- Détection d'anomalies (20+ produits en 1h = bot suspect)
- Statistiques quotidiennes par produit

---

## Architecture technique

### Stack actuel

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Server-Sent Events (SSE)

**Backend:**
- Next.js API Routes
- Groq API (llama-3.1-8b-instant)
- Prisma ORM
- SQLite

**Infrastructure:**
- SQLite (base de données locale)
- NextAuth.js (authentification)

### Flux principal (Assistant)

1. Utilisateur pose une question ou salutation
2. Frontend envoie message + historique complet à /api/assistant
3. Backend récupère catalogue produits de la DB
4. Envoie à Groq : system prompt + historique + question
5. Groq retourne réponse structurée (Réflexion/Découverte/Recommandation + CONFIDENCE/SCORES/SLUGS)
6. Frontend parse et affiche progressivement (streaming)
7. Si demande vague : affiche questions → attend réponse
8. Si demande claire : affiche recommandations avec cartes produits

### Modèles de données

| Modèle | Champs clés |
|--------|-----------|
| **User** | id, email, name, role (buyer/creator/admin), googleId, avatar |
| **Creator** | userId, slug, bio, tagline, specialty, verified, platform |
| **Product** | slug, title, description, category, price, status, views, clicks |
| **Review** | userId, productId, rating (1-5), comment, status |
| **TrackingLog** | productId, userId, ipAddress, userAgent, type (view/click), isBot, isRateLimited, isSuspicious |
| **DailyStats** | productId, date, views, clicks |

---

## État actuel du projet

### ✓ Complété

- ✅ Assistant IA streaming multi-tour
- ✅ Ordering sections correct (Réflexion → Découverte → Recommandation → Produits)
- ✅ Détection demandes vagues (pose questions au lieu de proposer par défaut)
- ✅ Accueil des salutations simples (bonjour, hi, salut)
- ✅ Design ProductCard (hover state, badges SVG, animations)
- ✅ Homepage polish (STEPS avec animations, FAQ interactive)
- ✅ Boutons & transitions globales (smooth transitions, focus rings, active states)
- ✅ Fraud Detection (bot detection, rate limiting, anomaly detection)
- ✅ Catalogue produits (recherche, filtrage, pages détail)
- ✅ Système d'avis (1-5 étoiles, form création)

### 🔄 En cours / À améliorer

- Optimisation contexte pour conversations très longues
- Tests UI complets pour zéro régressions
- Amélioration des questions de clarification (A/B testing)
- Documentation API complète
- Tests unitaires et intégration

---

## Commits récents

```
b73742c - Refactor: Supprimer fallback 'produits populaires' pour assistant vraiment intelligent
fde55f6 - Fix: Détecter et accueillir les salutations simples (bonjour, hi, salut, etc.)
e1744d0 - Peaufiner assistant IA: ordering, structure multi-tour, détection demandes vagues
3d75123 - Fix responsive de la section Assistant IA
620a310 - Passe responsive: carte produit, filtre, échelle des titres
```

---

## Prochaines étapes (optionnel)

- Optimiser le contexte pour très longues conversations (pagination/résumé historique)
- Tester UI complète en live (zéro régressions visuelles)
- A/B testing sur formulation des questions de clarification
- Améliorer détection confiance (tuning du prompt Groq)
- Analytics dashboard pour créateurs
- Intégration paiement (Stripe)
- Système de notifications en temps réel

---

**Nuvora** — Marketplace IA-first pour produits numériques

Stack: Next.js 16 + React 19 + Tailwind CSS v4 + Prisma + Groq

Dernière mise à jour : Août 2026
