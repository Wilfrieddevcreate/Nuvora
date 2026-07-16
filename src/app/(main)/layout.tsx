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
            <TopBar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
