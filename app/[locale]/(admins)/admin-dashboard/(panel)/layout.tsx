import { AdminProviders } from "@/components/admin/AdminProviders";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSuperAdminGuard } from "@/components/admin/AdminSuperAdminGuard";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <AdminShell>
        <AdminSuperAdminGuard>{children}</AdminSuperAdminGuard>
      </AdminShell>
    </AdminProviders>
  );
}
