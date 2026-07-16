// Données des articles de blog Nuvora — contenu statique hardcodé.

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  featured: boolean;
  content: string; // Markdown simplifié : ## titres, paragraphes \n\n, - listes
  relatedSlugs: string[]; // 2 slugs d'articles liés
};

export const POSTS: BlogPost[] = [
  {
    slug: "comment-vendre-ebook-en-ligne",
    title: "Comment vendre votre ebook en ligne en 2025",
    excerpt:
      "Guide complet pour lancer et monétiser votre ebook : choix de la plateforme, pricing, promotion.",
    category: "Guide créateur",
    readTime: "8 min",
    date: "12 juillet 2025",
    author: "Léa M.",
    featured: true,
    relatedSlugs: ["tarifer-formation-en-ligne", "gumroad-vs-systeme-io"],
    content: `## Pourquoi vendre un ebook en 2025 reste rentable

Contrairement aux idées reçues, le marché de l'ebook n'est pas saturé. La demande de contenus spécialisés et niches continue de croître, portée par des acheteurs qui cherchent des réponses concrètes à des problèmes précis. Un ebook bien positionné peut générer des revenus passifs sur plusieurs années.

La clé est de ne pas viser un sujet trop large. "Marketing digital" ne se vend plus. "Comment obtenir ses 100 premiers abonnés newsletter en tant que coach freelance" — c'est un autre niveau.

## Choisir la bonne plateforme de vente

Plusieurs options s'offrent à vous selon votre niveau et vos besoins :

- **Gumroad** : idéal pour débuter, interface simple, commission de 10 % sur les ventes. Parfait si vous avez déjà une audience.
- **Systeme.io** : solution française tout-en-un (page de vente, email, tunnel). Commission 0 % sur le plan gratuit, très complet.
- **Podia** : orienté créateurs avec abonnement mensuel fixe, zéro commission.

Pour un premier ebook, Gumroad offre le meilleur rapport simplicité/exposition. Référencez ensuite votre produit sur Nuvora pour capter le trafic organique dans votre catégorie.

## Fixer le bon prix

Le pricing d'un ebook dépend de trois facteurs : la transformation promise, la longueur perçue (les pages comptent moins que la valeur), et votre positionnement.

- Entre 7 € et 19 € : ebook court, entrée de gamme, pensé pour générer du volume.
- Entre 25 € et 49 € : ebook premium, sujet technique ou niché, audience qualifiée.
- 50 € et plus : ebook-formation hybride, accompagné d'un workbook ou de ressources.

Commencez à 19 €, testez pendant 30 jours, puis ajustez à la hausse si le taux de conversion est bon.

## Créer une page de vente qui convertit

Votre page de vente doit répondre à une question : "Qu'est-ce que je vais obtenir, concrètement ?"

- Un titre orienté résultat (pas "Mon guide sur le SEO" mais "Passez en première page Google en 60 jours")
- 3 à 5 bénéfices concrets, formulés comme des transformations
- Un extrait du sommaire pour rassurer sur le contenu
- Un ou deux témoignages, même de lecteurs bêta
- Une FAQ courte pour lever les objections

## Promouvoir votre ebook sans budget pub

Le trafic organique est votre meilleur ami au démarrage :

- Publiez 2 à 3 extraits sur vos réseaux en mentionnant l'ebook
- Écrivez un article de blog qui résout partiellement le problème, et pointez vers l'ebook pour aller plus loin
- Proposez votre ebook à des newsletters dans votre thématique (partenariat ou échange)
- Référencez-le sur Nuvora pour capter les recherches dans votre catégorie

Le bouche-à-oreille fait le reste si le contenu est au niveau.`,
  },
  {
    slug: "meilleures-formations-ia-2025",
    title: "Les meilleures formations IA pour débutants en 2025",
    excerpt:
      "Notre sélection des formations IA les plus accessibles et complètes pour apprendre l'intelligence artificielle.",
    category: "Sélection",
    readTime: "5 min",
    date: "8 juillet 2025",
    author: "Karim B.",
    featured: true,
    relatedSlugs: ["notion-templates-productivite", "seo-produits-digitaux"],
    content: `## Apprendre l'IA en 2025 : par où commencer ?

L'intelligence artificielle est désormais incontournable, que vous soyez développeur, marketer, designer ou entrepreneur. Le problème : l'offre de formations est immense et de qualité très variable. Voici notre sélection des formations les plus solides pour partir sur de bonnes bases.

## Critères de sélection

Nous avons évalué chaque formation sur quatre critères :

- Accessibilité pour un débutant sans bagage technique
- Qualité des exercices pratiques (pas seulement de la théorie)
- Mise à jour régulière (l'IA évolue vite)
- Rapport qualité/prix

## Les formations retenues

**ChatGPT et Prompt Engineering : Fondamentaux**
Formation de 3h30 en français, idéale pour comprendre comment formuler des requêtes efficaces. Couvre ChatGPT, Claude et Gemini avec des cas pratiques par métier.

- Niveau : débutant complet
- Prix : 29 €
- Points forts : exercices par secteur (marketing, RH, dev, éducation)

**IA pour non-développeurs — Automatisation avec Make + ChatGPT**
Formation en vidéo qui enseigne comment automatiser des tâches répétitives sans coder. Cas pratiques : génération de contenus, traitement d'emails, création de rapports.

- Niveau : débutant à intermédiaire
- Prix : 49 €
- Points forts : scénarios directement réutilisables

**Python pour l'IA — Zero to Hero**
Si vous souhaitez aller plus loin côté technique, cette formation progressive couvre Python, les bases du machine learning et l'utilisation des API OpenAI et Anthropic.

- Niveau : intermédiaire (notions de logique requises)
- Prix : 79 €
- Points forts : projets concrets, communauté active

## Ce qu'il faut éviter

Méfiez-vous des formations qui promettent de "maîtriser l'IA en 2 heures" ou qui n'ont pas été mises à jour depuis 2023. Le domaine évolue trop vite pour que des contenus datés restent pertinents.

Privilégiez les formations avec une communauté active ou un suivi du formateur : les questions pratiques émergent toujours après les vidéos.

## Notre recommandation

Pour un débutant absolu, commencez par la formation Prompt Engineering. Elle vous donnera une base concrète immédiatement applicable, quel que soit votre secteur. Passez ensuite à l'automatisation si vous cherchez à gagner du temps sur des tâches récurrentes.`,
  },
  {
    slug: "notion-templates-productivite",
    title: "5 templates Notion pour booster votre productivité",
    excerpt:
      "Découvrez les templates Notion les plus utilisés par les freelances et créateurs pour s'organiser efficacement.",
    category: "Ressources",
    readTime: "4 min",
    date: "3 juillet 2025",
    author: "Léa M.",
    featured: false,
    relatedSlugs: ["meilleures-formations-ia-2025", "tarifer-formation-en-ligne"],
    content: `## Pourquoi utiliser des templates Notion ?

Notion est un outil puissant, mais sa flexibilité est aussi sa faiblesse : partir d'une page blanche demande du temps et des tâtonnements. Les templates permettent de sauter directement à un système fonctionnel, testé par des milliers d'utilisateurs.

Voici 5 templates qui ont prouvé leur efficacité pour les créateurs et freelances.

## 1. Dashboard freelance tout-en-un

Ce template centralise vos clients, projets, factures et tâches dans une seule interface. Une base de données relationnelle relie chaque tâche à son client et projet. Les vues Kanban, calendrier et liste couvrent tous les cas d'usage.

- Idéal pour : consultants, développeurs freelance, graphistes
- Temps de setup : 30 minutes

## 2. Système de gestion de contenu (créateurs)

Planifiez vos publications sur tous vos canaux depuis un seul endroit. Ce template inclut un pipeline éditorial avec statuts (idée, en cours, publié), un calendrier visuel et une base de données de ressources réutilisables.

- Idéal pour : YouTubers, blogueurs, créateurs de newsletters
- Temps de setup : 45 minutes

## 3. CRM personnel simplifié

Suivez vos contacts, prospects et partenaires sans payer un abonnement CRM. Chaque contact a une fiche avec historique des échanges, prochaine action et niveau de priorité.

- Idéal pour : commerciaux indépendants, coachs, consultants
- Temps de setup : 20 minutes

## 4. Tracker d'objectifs et habitudes

Inspiré du système OKR mais simplifié pour les solopreneurs. Définissez vos objectifs trimestriels, déclinez-les en habitudes quotidiennes et suivez votre progression avec un tableau de bord visuel.

- Idéal pour : entrepreneurs, étudiants, créateurs en mode side project
- Temps de setup : 15 minutes

## 5. Base de connaissances personnelle

Un wiki personnel pour capturer vos apprentissages, notes de livres, veille tech et idées de projets. Système de tags et liens bidirectionnels pour retrouver l'information en secondes.

- Idéal pour : formateurs, chercheurs, développeurs, tout curieux
- Temps de setup : 1 heure (selon la migration de notes existantes)

## Comment choisir

Commencez par un seul template, pas cinq. Choisissez celui qui résout votre problème le plus urgent. Adaptez-le à votre façon de travailler — un template n'est jamais parfait tel quel, et c'est normal. L'objectif est de gagner du temps sur la structure pour se concentrer sur le fond.`,
  },
  {
    slug: "tarifer-formation-en-ligne",
    title: "Comment tarifer votre formation en ligne",
    excerpt:
      "Les stratégies de pricing pour vos formations : positionnement, test de prix, augmentation progressive.",
    category: "Guide créateur",
    readTime: "6 min",
    date: "28 juin 2025",
    author: "Wilfried H.",
    featured: false,
    relatedSlugs: ["comment-vendre-ebook-en-ligne", "gumroad-vs-systeme-io"],
    content: `## Le pricing, la décision la plus sous-estimée

La majorité des créateurs fixent leurs prix en regardant la concurrence. C'est une erreur. Le prix d'une formation ne dépend pas de sa durée en heures, ni du prix moyen du marché. Il dépend de la transformation que vous promettez et de votre capacité à la tenir.

Un cours de 2h qui aide quelqu'un à décrocher ses premiers clients freelance vaut 200 € si vous pouvez le prouver. Un cours de 20h sur "tout ce que vous devez savoir sur le marketing" peine à se vendre à 49 €.

## Les trois modèles de pricing

**Modèle d'entrée de gamme (29 € – 79 €)**
Adapté aux formations courtes sur un sujet très précis. L'objectif est le volume et l'acquisition de nouveaux clients dans votre écosystème. Ne pas perdre d'argent dessus, mais ne pas en vivre.

**Modèle intermédiaire (97 € – 297 €)**
La zone de confort de la plupart des formateurs. Ce positionnement fonctionne pour les formations complètes avec un suivi léger (accès à un groupe, Q&A mensuel). La perception de valeur est bonne, le ticket d'entrée reste accessible.

**Modèle premium (400 € et plus)**
Réservé aux formations avec un fort accompagnement, un accès direct au formateur, ou un débouché concret mesurable (certification, placement, ROI chiffré). Nécessite une preuve sociale solide.

## Comment tester votre prix

Ne lancez pas en supposant. Testez avec une liste d'attente :

- Annoncez votre formation à venir avec un "prix de lancement" à -30 % pour les 20 premiers
- Observez le taux de conversion
- Si la liste se remplit vite, votre prix réel est probablement encore trop bas
- Si la liste stagne, le problème est soit le prix, soit la promesse (souvent les deux)

## L'augmentation progressive

La meilleure stratégie long terme est d'augmenter progressivement :

- Lancement : prix bas pour collecter des témoignages et valider la transformation
- Deuxième session : +20 à 30 % avec les témoignages comme preuve
- Version V2 enrichie : nouveau prix, repositionnement

Cette approche a deux avantages : elle crée un sentiment d'urgence chez les acheteurs potentiels et elle reflète fidèlement la valeur croissante de votre offre.

## Ce que le prix dit de vous

Un prix trop bas nuit à votre crédibilité. Les acheteurs rationalisent : "Si c'est si bon, pourquoi c'est si peu cher ?" Un prix aligné avec la transformation promise dit à votre audience que vous êtes sérieux.

Assumez votre prix. Si vous devez expliquer longuement pourquoi votre formation vaut son prix, c'est que la promesse n'est pas assez claire — et non que le prix est trop élevé.`,
  },
  {
    slug: "gumroad-vs-systeme-io",
    title: "Gumroad vs Systeme.io : lequel choisir en 2025 ?",
    excerpt:
      "Comparatif détaillé des deux plateformes les plus populaires pour vendre des produits digitaux.",
    category: "Comparatif",
    readTime: "7 min",
    date: "20 juin 2025",
    author: "Karim B.",
    featured: false,
    relatedSlugs: ["comment-vendre-ebook-en-ligne", "tarifer-formation-en-ligne"],
    content: `## Pourquoi comparer ces deux plateformes ?

Gumroad et Systeme.io sont les deux références francophones pour vendre des produits digitaux. Chacune a ses forces, et le choix dépend de votre situation : audience existante ou non, type de produit, budget, compétences techniques.

Ce comparatif est basé sur une utilisation réelle des deux plateformes en 2025.

## Gumroad : le spécialiste du produit digital

Gumroad existe depuis 2011. C'est la plateforme de référence pour vendre rapidement un produit digital sans infrastructure complexe.

**Points forts :**
- Configuration en moins d'une heure
- Discover (marketplace interne) pour générer du trafic sans audience
- Abonnements, "pay what you want", bundles natifs
- Interface acheteur claire et rassurante

**Points faibles :**
- Commission de 10 % sur chaque vente (plan gratuit)
- Pas de funnel ni d'email marketing intégré
- Personnalisation limitée de la page de vente
- Pas de certificats pour les formations

**Idéal pour :** créateurs avec une audience existante, vente d'ebooks et templates, projets secondaires.

## Systeme.io : le tout-en-un français

Systeme.io est une plateforme française créée en 2018. Elle se positionne comme un tout-en-un : pages de vente, email marketing, funnels, cours en ligne, affiliés.

**Points forts :**
- Plan gratuit généreux avec 0 % de commission
- Tunnels de vente et séquences email inclus
- Cours en ligne avec espace membre
- Affiliés natifs pour recruter des apporteurs d'affaires

**Points faibles :**
- Courbe d'apprentissage plus longue
- Pas de marketplace intégrée (vous ramenez votre propre trafic)
- Personnalisation du design plus rigide
- Support parfois lent en français

**Idéal pour :** formateurs qui veulent automatiser leur business, vente de formations, créateurs qui construisent un écosystème complet.

## Le verdict par profil

- **Vous débutez et n'avez pas d'audience :** Gumroad pour la visibilité Discover + Nuvora pour être trouvé dans le catalogue.
- **Vous avez déjà une liste email :** Systeme.io pour automatiser vos lancements et vos relances.
- **Vous vendez des templates ou ebooks simples :** Gumroad, c'est le plus rapide à mettre en place.
- **Vous construisez un business formation sur le long terme :** Systeme.io, malgré la courbe d'apprentissage.

## La combinaison gagnante

Beaucoup de créateurs utilisent les deux : Gumroad pour les produits d'entrée de gamme et le trafic Discover, Systeme.io pour les offres premium et les funnels. Ce n'est pas obligatoire, mais cela permet de maximiser chaque levier.

Dans tous les cas, référencez vos produits sur Nuvora pour capter les acheteurs qui cherchent activement dans votre catégorie. Cette présence est complémentaire aux deux plateformes.`,
  },
  {
    slug: "seo-produits-digitaux",
    title: "SEO pour produits digitaux : se faire trouver sur Google",
    excerpt:
      "Stratégies SEO adaptées aux créateurs de produits digitaux pour générer du trafic organique.",
    category: "Marketing",
    readTime: "9 min",
    date: "15 juin 2025",
    author: "Wilfried H.",
    featured: false,
    relatedSlugs: ["comment-vendre-ebook-en-ligne", "meilleures-formations-ia-2025"],
    content: `## Le SEO, le canal le plus sous-exploité par les créateurs

La majorité des créateurs de produits digitaux misent sur les réseaux sociaux pour générer du trafic. C'est légitime, mais risqué : un changement d'algorithme et votre visibilité s'effondre. Le SEO, lui, construit une présence durable.

Bonne nouvelle : la concurrence SEO sur les niches de produits digitaux reste faible. Il n'y a pas besoin d'un domaine âgé de 10 ans pour ranker. Voici comment démarrer efficacement.

## Comprendre l'intention de recherche

Avant d'écrire quoi que ce soit, posez-vous la question : que cherche vraiment quelqu'un qui tape ce mot-clé ?

- "template Notion freelance" → intention commerciale (l'utilisateur veut acheter)
- "comment utiliser Notion pour gérer ses clients" → intention informationnelle (l'utilisateur veut apprendre)
- "meilleur template Notion" → intention comparative

Pour vos pages produits, ciblez les intentions commerciales et comparatives. Pour votre blog, ciblez les intentions informationnelles pour attirer des visiteurs qualifiés.

## Recherche de mots-clés pour produits digitaux

Outils gratuits pour commencer :

- **Google Search Console** : si vous avez un site existant, c'est votre source de données numéro un
- **Google Suggest** : tapez votre sujet dans Google et notez les suggestions
- **AnswerThePublic** : questions posées autour d'un sujet
- **Ubersuggest** (plan gratuit) : volume estimé et difficulté

Ciblez des mots-clés longue traîne avec moins de 1 000 recherches mensuelles au départ. Ils convertissent mieux et sont plus faciles à ranker.

## Optimiser votre page produit

Chaque page produit doit respecter ces règles :

- Titre H1 avec le mot-clé principal (ex : "Template Notion gestion clients freelance")
- Méta-description de 150-160 caractères avec un appel à l'action
- Description longue (300+ mots) avec les variantes sémantiques
- URL courte et lisible : /template-notion-freelance plutôt que /product-id-1234
- Données structurées (schema.org Product) pour les rich snippets

## Créer du contenu qui attire vos acheteurs idéaux

Le blog est votre principal levier SEO. Chaque article doit :

- Répondre à une question que pose votre visiteur idéal
- Pointer naturellement vers votre produit en fin d'article
- Avoir au minimum 800 mots (1 500 pour les sujets compétitifs)
- Être mis à jour au moins une fois par an

Exemples d'articles qui convertissent pour des produits digitaux :

- "Comment [résoudre problème X] : le template qui m'a sauvé 3h par semaine"
- "Les [N] meilleurs outils pour [type d'utilisateur] en [année]"
- "Comparatif : [option A] vs [option B] pour [cas d'usage]"

## Les erreurs à éviter

- Créer du contenu sans structure (pas de H2, pas de H3)
- Négliger les balises title et meta description
- Avoir plusieurs pages qui ciblent le même mot-clé (cannibalisation)
- Ignorer les Core Web Vitals (vitesse de chargement, stabilité visuelle)

## Mesurer et itérer

Installez Google Search Console dès le départ. Après 3 mois, identifiez les pages qui apparaissent en position 5-20 : ce sont celles qui ont le plus de potentiel avec un peu d'optimisation supplémentaire (plus de contenu, meilleur maillage interne). Le SEO est un jeu de long terme, mais les premiers résultats arrivent souvent entre 60 et 90 jours.`,
  },
];
