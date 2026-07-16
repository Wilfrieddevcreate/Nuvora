import { redirect } from "next/navigation";
import { AuthProvider } from "@/contexts/auth";
import { ToastProvider } from "@/contexts/toast";
import { getCurrentUser } from "@/lib/dal";
import { AdminClientLayout } from "@/app/(admin)/admin/layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/connexion");
  }

  return (
    <ToastProvider>
      <AuthProvider user={user}>
        <AdminClientLayout>{children}</AdminClientLayout>
      </AuthProvider>
    </ToastProvider>
  );
}
