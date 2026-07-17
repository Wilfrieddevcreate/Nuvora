import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import Link from "next/link";

export const metadata = {
  title: "Notifications — Dashboard",
};

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  productId: string | null;
};

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
  product_approved: { bg: "bg-green-50", text: "text-green-600", icon: "✅" },
  product_rejected: { bg: "bg-red-50", text: "text-red-600", icon: "❌" },
  review_received: { bg: "bg-blue-50", text: "text-blue-600", icon: "💬" },
  creator_verified: { bg: "bg-accent-soft", text: "text-accent", icon: "🔐" },
};

function getTypeColor(type: string) {
  return typeColors[type] || { bg: "bg-surface-2", text: "text-fg", icon: "📧" };
}

export default async function NotificationsPage() {
  const session = await verifySession();

  const notifications = await db.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Notifications</h1>
          <p className="mt-2 text-fg-2">
            {notifications.filter((n: any) => !n.read).length} non lue{notifications.filter((n: any) => !n.read).length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-fg font-medium">Aucune notification</p>
          <p className="text-fg-2 text-sm mt-2">Vous recevrez une notification dès qu'il y a des mises à jour sur vos produits.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: Notification) => {
            const typeStyle = getTypeColor(notif.type);
            return (
              <div
                key={notif.id}
                className={`rounded-2xl border border-border p-5 transition-colors ${
                  notif.read ? "bg-surface" : typeStyle.bg
                }`}
              >
                <div className="flex gap-4">
                  <div className={`text-3xl shrink-0 ${typeStyle.text}`}>
                    {typeStyle.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-fg">{notif.title}</h3>
                    <p className="text-fg-2 text-sm mt-1">{notif.message}</p>
                    <p className="text-muted text-xs mt-3">
                      {formatRelativeTime(new Date(notif.createdAt))}
                    </p>
                  </div>
                  {notif.productId && (
                    <Link
                      href={`/produit/${notif.productId}`}
                      className="shrink-0 text-accent text-sm font-medium hover:opacity-80 h-fit"
                    >
                      Voir →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes}m`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString("fr-FR");
}
