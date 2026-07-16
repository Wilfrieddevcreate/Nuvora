import { TopBar } from "@/components/top-bar";
import { SiteFooter } from "@/components/site-footer";
import { FavoritesProvider } from "@/contexts/favorites";
import { AuthProvider } from "@/contexts/auth";
import { ToastProvider } from "@/contexts/toast";

// Layout des pages publiques : header + footer.
export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ToastProvider>
      <AuthProvider>
        <FavoritesProvider>
          <div className="flex min-h-dvh flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-9999 focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-accent-fg focus:shadow-soft-lg"
            >
              Aller au contenu principal
            </a>
            <TopBar />
            <main id="main-content" className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
