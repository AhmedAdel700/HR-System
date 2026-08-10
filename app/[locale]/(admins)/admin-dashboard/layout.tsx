import { AdminDashboardRoot } from "@/components/admin/AdminDashboardRoot";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardRoot>{children}</AdminDashboardRoot>;
}
