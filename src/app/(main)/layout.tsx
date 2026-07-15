import { TopBar } from "@/components/top-bar";
import { SiteFooter } from "@/components/site-footer";

// Layout des pages publiques : header + footer.
export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
