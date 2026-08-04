"use client";

import { useEffect, useRef, useState } from "react";
import { useTransition } from "react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/app/actions/notifications";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  productId?: string;
};

export function NotificationsBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch {
        // Silent fail, user not logged in likely
      }
    };
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    if (!open) return;
    try {
      const data = await getNotifications();
      setNotifications(data as any);
    } catch {
      // Silent fail
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    });
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    });
  };

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="relative inline-flex items-center justify-center size-10 rounded-lg text-muted hover:bg-surface-2 hover:text-fg transition-colors"
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 inline-flex items-center justify-center size-5 rounded-full bg-danger text-white text-xs font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="fixed top-12 right-4 z-50 w-96 max-h-96 rounded-2xl border border-border bg-surface shadow-soft-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isPending}
                  className="text-xs font-medium text-accent hover:opacity-80 disabled:opacity-50"
                >
                  Marquer tout comme lu
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                  <svg viewBox="0 0 24 24" className="size-12 text-muted/40 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <p className="text-sm font-medium text-fg">Aucune notification</p>
                  <p className="text-xs text-muted mt-1">Vous recevrez une notification dès qu'il y a des mises à jour.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`border-b border-border px-4 py-3 hover:bg-surface-2 transition-colors ${
                      !notif.read ? "bg-accent-soft/30" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm text-fg">{notif.title}</p>
                          <button
                            onClick={() => handleDelete(notif.id)}
                            disabled={isPending}
                            className="text-muted hover:text-fg text-xs disabled:opacity-50"
                            aria-label="Supprimer"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-fg-2 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[11px] text-muted mt-2">
                          {formatRelativeTime(new Date(notif.createdAt))}
                        </p>
                      </div>
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          disabled={isPending}
                          className="shrink-0 size-2 rounded-full bg-accent disabled:opacity-50"
                          aria-label="Marquer comme lu"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}
    </>
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
