import { redirect } from "next/navigation";
import { AuthProvider } from "@/contexts/auth";
import { ToastProvider } from "@/contexts/toast";
import { getCurrentUser } from "@/lib/dal";
import { DashboardClientLayout } from "@/app/(dashboard)/dashboard/layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "creator" && user.role !== "admin")) {
    redirect("/connexion");
  }

  return (
    <ToastProvider>
      <AuthProvider user={user}>
        <DashboardClientLayout>{children}</DashboardClientLayout>
      </AuthProvider>
    </ToastProvider>
  );
}
