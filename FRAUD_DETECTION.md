# Système de Détection de Fraude - Nuvora

## 📋 Table des matières

1. [Problématique](#problématique)
2. [Solution](#solution)
3. [Architecture](#architecture)
4. [Fonctionnalités](#fonctionnalités)
5. [Implémentation](#implémentation)
6. [Monitoring et Audit](#monitoring-et-audit)
7. [Configuration](#configuration)

---

## Problématique

### Enjeu Business
Sur la plateforme Nuvora, les créateurs de contenu digital proposent leurs produits (formations, templates, ebooks, etc.). Comme pour tout marketplace, **les métriques de popularité sont critiques** :
- Les **vues** donnent une indication de l'intérêt
- Les **clics** montrent la volonté d'achat
- Ces métriques influencent le classement et la visibilité des produits

### Le Risque : Inflation Artificielle
Sans système de protection, plusieurs menaces peuvent survenir :

1. **Bots et Crawlers** : Scripts automatisés gonflant les statistiques
2. **Click Fraud** : Utilisateurs ou services externes générant des clics artificiels
3. **Manipulation de Classement** : Des créateurs malveillants cliquant massivement sur leurs propres produits
4. **Concurrence déloyale** : Bots sur-cliquant les produits des concurrents pour les discréditer
5. **Usurpation de Métriques** : Vues/clics sans vrai intérêt utilisateur

### Conséquences
- 📊 Données de suivi non fiables
- 🎯 Classements faussés
- 💰 Recommandations inexactes
- 😞 Créateurs légitimes désavantagés
- ⚠️ Crédibilité de la plateforme endommagée

---

## Solution

### Approche Adoptée

Nous avons implémenté un **système multi-couches de détection de fraude** qui :

1. **Détecte en temps réel** les patterns suspects
2. **Loggue tout** pour audit et analyse
3. **Valide les requêtes** avant d'incrémenter les métriques
4. **Flagge les anomalies** pour investigation

```
Événement (vue/clic)
    ↓
┌─────────────────────────────────┐
│  1. Bot Detection               │  Analyse user-agent
│  2. Rate Limiting               │  Limite par IP/utilisateur
│  3. Anomaly Detection           │  Patterns suspects
└─────────────────────────────────┘
    ↓
Valid? ──Yes→ Incrémenter compteurs + Logger
    │
    No→ Logger uniquement (flag comme fraude) + Ne pas compter
```

### Principes Clés

✅ **Allow by default, block on evidence** - On accepte par défaut mais on flag les suspicions  
✅ **Log everything** - Chaque événement est enregistré pour audit  
✅ **Non-blocking** - Le tracking ne ralentit pas l'expérience utilisateur  
✅ **Tunable** - Les seuils peuvent être ajustés sans redéploiement  

---

## Architecture

### Composants Principaux

#### 1. Module de Détection (`src/lib/fraud-detection.ts`)

```typescript
// Exports principaux:
- detectBot(userAgent?: string): boolean
- isRateLimited(context): Promise<{limited, reason?}>
- detectAnomaly(context): Promise<{suspicious, reason?}>
- validateTrackingRequest(context): Promise<{valid, reason?}>
- logTracking(context, flags): Promise<void>
```

#### 2. Base de Données - Table TrackingLog

```sql
CREATE TABLE TrackingLog (
  id              TEXT PRIMARY KEY        -- UUID unique
  productId       TEXT NOT NULL           -- Produit visité
  userId          TEXT                    -- Utilisateur (nullable)
  ipAddress       TEXT                    -- Adresse IP
  userAgent       TEXT                    -- Navigateur
  type            TEXT NOT NULL           -- "view" | "click"
  isBot           BOOLEAN DEFAULT false   -- Flag: bot détecté?
  isRateLimited   BOOLEAN DEFAULT false   -- Flag: rate limit dépassé?
  isSuspicious    BOOLEAN DEFAULT false   -- Flag: pattern anormal?
  timestamp       DATETIME DEFAULT NOW    -- Quand
);

-- Indexes pour requêtes rapides
INDEX productId, userId, ipAddress, timestamp, isBot, isSuspicious
```

#### 3. Actions Serveur (`src/app/actions/products.ts`)

```typescript
export async function trackProductView(
  productId: string,
  context?: { ipAddress?: string; userAgent?: string }
): Promise<void>

export async function trackProductClick(
  productId: string,
  context?: { ipAddress?: string; userAgent?: string }
): Promise<void>
```

#### 4. Pages & Composants

- **Page produit** : Appelle `trackProductView()` avec headers
- **Bouton achat** : Appelle `trackProductClick()` (headers récupérés auto)

---

## Fonctionnalités

### 1. Bot Detection 🤖

**Objectif** : Identifier et filtrer les crawlers/bots

**Fonctionnement** :
- Analyse le header `User-Agent` de la requête
- Détecte les patterns connus : "bot", "crawler", "spider", "scraper", "curl", "wget", "python", "java", "node", "phantom", "headless"
- Retour : `true` si bot détecté, `false` sinon

**Exemple** :
```typescript
detectBot("Mozilla/5.0 (compatible; Googlebot/2.1)") → true
detectBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0") → false
```

**Action** :
- Si bot détecté → Flag `isBot = true`, événement loggé mais **pas compté**

---

### 2. Rate Limiting ⏱️

**Objectif** : Prévenir les clics/vues rapides et répétitifs

**Seuils Actuels** :
- **Vues** : Max 10 vues/heure par IP/utilisateur
- **Clics** : Max 5 clics/heure par IP/utilisateur

**Fonctionnement** :
1. Récupère les 60 dernières minutes pour la source (IP ou userId)
2. Compte les événements du type actuel
3. Compare avec le seuil
4. Retour : `{ limited: boolean, reason?: string }`

**Exemple de Scénario** :
```
14:00 - Vue 1 ✅ (1/10)
14:01 - Vue 2 ✅ (2/10)
14:02 - Vue 3 ✅ (3/10)
...
14:09 - Vue 10 ✅ (10/10)
14:10 - Vue 11 ❌ Rate limited! (flag)
        Raison: "Rate limit exceeded: 11/10 views in last hour"
```

**Action** :
- Si rate limitée → Flag `isRateLimited = true`, ne pas compter

---

### 3. Anomaly Detection 🔍

**Objectif** : Flaguer les patterns d'utilisation suspects

**Patterns Détectés** :
| Pattern | Seuil | Interprétation |
|---------|-------|----------------|
| Produits différents en 1h | > 20 | Visite massive multi-produits = bot typique |
| Clics en 1h | > 10 | Clicking spree = suspicious |

**Exemple de Scénario** :
```
Utilisateur IP: 192.168.1.100 en 1 heure

Minute 1:  Clic produit A
Minute 2:  Clic produit B
Minute 3:  Clic produit C
...
Minute 10: Clic produit J
→ 10 clics = SUSPICIOUS! Flag anomaly

OU

Clic produit A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T
→ 20 produits différents = SUSPICIOUS! Flag anomaly
```

**Action** :
- Si anomalie détectée → Flag `isSuspicious = true`, mais **continue de compter**
- Raison : Les vrais patterns suspects sont rares, on préfère investiguer après

---

### 4. Logging Complet 📝

**Objectif** : Tracer chaque événement pour audit/investigation

**Ce qui est enregistré** :
```typescript
{
  id: "unique-id",              // Pour tracer
  productId: string,            // Quel produit?
  userId: string | null,        // Quel utilisateur?
  ipAddress: string,            // Quelle source?
  userAgent: string | null,     // Quel navigateur/bot?
  type: "view" | "click",       // Quoi?
  isBot: boolean,               // Flag de détection
  isRateLimited: boolean,       // Flag rate limit
  isSuspicious: boolean,        // Flag anomalie
  timestamp: DateTime           // Quand?
}
```

**Avantages** :
- ✅ Rejouable : On peut rejouer les événements
- ✅ Auditable : Historique complet des décisions
- ✅ Analysable : Data brute pour ML/investigation
- ✅ Examinable : Admin peut enquêter sur les comptes suspects

---

### 5. Validation Orchestrée

**Processus d'une Requête** :

```javascript
// 1. Récupérer contexte
const context = {
  productId: "prod-123",
  ipAddress: "203.0.113.45",      // Du header x-forwarded-for
  userAgent: "Mozilla/5.0...",    // Du header user-agent
  type: "view"
};

// 2. Valider
const validation = await validateTrackingRequest(context);
// Retour: { valid: true/false, reason?: string }

// 3. Analyser pour flags
const isBot = detectBot(userAgent);
const anomaly = await detectAnomaly(context);

// 4. Logguer
await logTracking(context, {
  isBot,
  rateLimited: !validation.valid,
  suspicious: anomaly.suspicious
});

// 5. Incrémenter seulement si valide
if (validation.valid) {
  await db.product.update({
    where: { id: productId },
    data: { views: { increment: 1 } }
  });
}
```

---

## Implémentation

### Fichiers Modifiés/Créés

#### 1. `prisma/schema.prisma` ✨ NEW
```prisma
model TrackingLog {
  id            String   @id @default(cuid())
  productId     String
  userId        String?
  ipAddress     String?
  userAgent     String?
  type          String   // "view" | "click"
  isBot         Boolean  @default(false)
  isRateLimited Boolean  @default(false)
  isSuspicious  Boolean  @default(false)
  timestamp     DateTime @default(now())

  @@index([productId])
  @@index([userId])
  @@index([ipAddress])
  @@index([timestamp])
  @@index([isBot])
  @@index([isSuspicious])
}
```

#### 2. `src/lib/fraud-detection.ts` ✨ NEW

Module principal contenant :
- `detectBot(userAgent?: string): boolean`
- `isRateLimited(context: TrackingContext): Promise<...>`
- `detectAnomaly(context: TrackingContext): Promise<...>`
- `validateTrackingRequest(context: TrackingContext): Promise<...>`
- `logTracking(context: TrackingContext, flags: {...}): Promise<void>`

#### 3. `src/app/actions/products.ts` 🔄 MODIFIÉ

```typescript
// Avant
export async function trackProductView(productId: string): Promise<void> {
  await db.product.update({ data: { views: { increment: 1 } } });
}

// Après
export async function trackProductView(
  productId: string,
  context?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  const { validateTrackingRequest, logTracking, detectBot, detectAnomaly } 
    = await import("@/lib/fraud-detection");
  
  // Valider + Logger + Incrémenter seulement si OK
  const validation = await validateTrackingRequest(context);
  await logTracking(context, { isBot, rateLimited, suspicious });
  if (validation.valid) {
    await db.product.update({ data: { views: { increment: 1 } } });
  }
}
```

#### 4. `src/app/(main)/produit/[slug]/page.tsx` 🔄 MODIFIÉ

```typescript
import { headers } from "next/headers";

// Dans le server component:
const headersList = await headers();
const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";
const userAgent = headersList.get("user-agent") || undefined;

trackProductView(product.id, { ipAddress, userAgent }).catch(() => {});
```

#### 5. `prisma/migrations/20260804092857_add_tracking_log/` ✨ NEW

Migration SQL créant la table `TrackingLog` avec tous les indexes.

---

## Monitoring et Audit

### Requêtes Utiles pour les Admins

#### Voir tous les événements suspects
```sql
SELECT * FROM TrackingLog 
WHERE isBot = true OR isRateLimited = true OR isSuspicious = true
ORDER BY timestamp DESC
LIMIT 100;
```

#### Identifier les sources de fraude
```sql
SELECT ipAddress, COUNT(*) as event_count, COUNT(CASE WHEN isBot THEN 1 END) as bot_count
FROM TrackingLog
WHERE timestamp > datetime('now', '-24 hours')
GROUP BY ipAddress
HAVING bot_count > 0 OR event_count > 50
ORDER BY event_count DESC;
```

#### Vérifier l'impact sur un produit
```sql
SELECT 
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN NOT isBot AND NOT isRateLimited THEN 1 END) as valid,
  COUNT(CASE WHEN isBot OR isRateLimited OR isSuspicious THEN 1 END) as flagged
FROM TrackingLog
WHERE productId = 'prod-123'
GROUP BY type;
```

#### Voir les produits les plus attaqués
```sql
SELECT 
  productId,
  COUNT(*) as total_events,
  COUNT(CASE WHEN isSuspicious THEN 1 END) as suspicious_count
FROM TrackingLog
WHERE timestamp > datetime('now', '-7 days')
AND (isSuspicious = true OR isBot = true)
GROUP BY productId
ORDER BY suspicious_count DESC;
```

---

## Configuration

### Seuils Personnalisables

Les limites peuvent être ajustées dans `src/lib/fraud-detection.ts` :

```typescript
const RATE_LIMITS = {
  view: { max: 10, window: 3600000 },  // 10 vues/heure
  click: { max: 5, window: 3600000 },  // 5 clics/heure
};

// Patterns d'anomalies
if (productCount > 20) { /* suspicious */ }
if (clickCount > 10) { /* suspicious */ }
```

### Ajustement Futur

Pour modifier les limites :
1. Éditer `src/lib/fraud-detection.ts`
2. Redémarrer le serveur (pas de redéploiement nécessaire en dev)
3. Les nouveaux événements utilisent les nouvelles limites

### Extension Possible

Le système peut être étendu pour :
- 🔓 Ajouter IP addresses en whitelist (admins, équipe Nuvora)
- 🔐 Ajouter géo-blocking (prévenir trafic de pays suspects)
- 📱 Détecter empreintes numériques (même device = même source)
- 🧠 Appliquer ML pour patterns complexes
- 🎯 Intégrer services tiers (MaxMind GeoIP, etc.)

---

## Résumé Visuel

```
┌─────────────────────────────────────────────────────────────┐
│                  UTILISATEUR VISITE PRODUIT                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          Server Component récupère les headers              │
│  - IP (x-forwarded-for)                                     │
│  - User-Agent (navigateur/bot)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  trackProductView(id, {ip, ua})
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   CHAÎNE DE DÉTECTION                       │
│  1. detectBot()                                             │
│  2. isRateLimited()                                         │
│  3. detectAnomaly()                                         │
│  4. validateTrackingRequest() → VALID?                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────┴────────┐
                    ↓                ↓
                  VALIDE          FRAUDE
                    ↓                ↓
           ┌────────────────┐  ┌───────────────┐
           │ + Log entry    │  │ + Log entry   │
           │ + Incrémenter  │  │ (flag=1)      │
           │   vues         │  │ - PAS d'incr. │
           └────────────────┘  └───────────────┘
                    ↓                ↓
            Produit.views++   TrackingLog entry
            (compte réel)      (audit trail)
```

---

## Conclusion

Le système de détection de fraude de Nuvora :
- ✅ **Protège** l'intégrité des métriques
- ✅ **Loggue** chaque événement pour audit
- ✅ **Ne ralentit pas** l'expérience utilisateur
- ✅ **Est tunable** sans code change
- ✅ **Est prêt** pour expansion future

**Résultat** : Une plateforme où les créateurs légitimes peuvent compter sur des métriques justes et fiables ! 🎯
