import { db } from "@/lib/db";

// Known bot user-agents
const BOT_USER_AGENTS = [
  "bot",
  "crawler",
  "spider",
  "scraper",
  "curl",
  "wget",
  "python",
  "java",
  "node",
  "phantom",
  "headless",
];

// Rate limiting: max actions per user per time window
const RATE_LIMITS = {
  view: { max: 10, window: 3600000 }, // 10 views per hour
  click: { max: 5, window: 3600000 }, // 5 clicks per hour
};

export interface TrackingContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  productId: string;
  type: "view" | "click";
}

/**
 * Detect if the user-agent is a bot
 */
export function detectBot(userAgent?: string): boolean {
  if (!userAgent) return false;
  const lowerUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => lowerUA.includes(bot));
}

/**
 * Check if user is rate limited
 */
export async function isRateLimited(
  context: TrackingContext
): Promise<{ limited: boolean; reason?: string }> {
  const limit = RATE_LIMITS[context.type];
  if (!limit) return { limited: false };

  // Skip rate limiting for anonymous users without IP
  if (!context.userId && !context.ipAddress) {
    return { limited: false };
  }

  const timeWindow = new Date(Date.now() - limit.window);

  // Count recent actions (views or clicks) by user or IP
  const recentActions = await db.trackingLog.count({
    where: {
      type: context.type,
      timestamp: { gte: timeWindow },
      OR: [
        { userId: context.userId },
        { ipAddress: context.ipAddress },
      ],
    },
  });

  if (recentActions >= limit.max) {
    return {
      limited: true,
      reason: `Rate limit exceeded: ${recentActions}/${limit.max} ${context.type}s in last hour`,
    };
  }

  return { limited: false };
}

/**
 * Detect suspicious patterns (anomalies)
 */
export async function detectAnomaly(
  context: TrackingContext
): Promise<{ suspicious: boolean; reason?: string }> {
  if (!context.userId && !context.ipAddress) {
    return { suspicious: false };
  }

  const lastHour = new Date(Date.now() - 3600000);

  // Get all actions from this user/IP in the last hour
  const recentActions = await db.trackingLog.findMany({
    where: {
      timestamp: { gte: lastHour },
      OR: [
        { userId: context.userId },
        { ipAddress: context.ipAddress },
      ],
    },
    select: { productId: true, type: true },
  });

  // Check for suspicious patterns
  const productCount = new Set(recentActions.map((a) => a.productId)).size;
  const clickCount = recentActions.filter((a) => a.type === "click").length;

  // Suspicious: >20 different products in 1 hour = likely bot
  if (productCount > 20) {
    return {
      suspicious: true,
      reason: `Suspicious activity: ${productCount} different products in 1 hour`,
    };
  }

  // Suspicious: >10 clicks in 1 hour = likely bot
  if (clickCount > 10) {
    return {
      suspicious: true,
      reason: `Suspicious activity: ${clickCount} clicks in 1 hour`,
    };
  }

  return { suspicious: false };
}

/**
 * Log tracking action with fraud detection metadata
 */
export async function logTracking(
  context: TrackingContext,
  flags: { isBot?: boolean; rateLimited?: boolean; suspicious?: boolean }
) {
  try {
    await db.trackingLog.create({
      data: {
        productId: context.productId,
        userId: context.userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        type: context.type,
        isBot: flags.isBot || false,
        isRateLimited: flags.rateLimited || false,
        isSuspicious: flags.suspicious || false,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    // Fail silently - don't break the app if logging fails
    console.error("[Tracking] Failed to log:", error);
  }
}

/**
 * Validate and sanitize tracking request
 */
export async function validateTrackingRequest(
  context: TrackingContext
): Promise<{ valid: boolean; reason?: string }> {
  // Check for bot
  if (detectBot(context.userAgent)) {
    return { valid: false, reason: "Bot detected" };
  }

  // Check rate limiting
  const rateLimitCheck = await isRateLimited(context);
  if (rateLimitCheck.limited) {
    return { valid: false, reason: rateLimitCheck.reason };
  }

  // Check anomalies
  const anomalyCheck = await detectAnomaly(context);
  if (anomalyCheck.suspicious) {
    // Log suspicious but still allow (don't block, just flag)
    console.warn("[Tracking] Suspicious activity:", anomalyCheck.reason);
  }

  return { valid: true };
}
