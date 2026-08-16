import {
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardList,
  Fingerprint,
  LayoutDashboard,
  MapPinned,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { isSuperAdmin } from "@/lib/admin/permissions";
import type { AdminRole } from "@/types/AdminApiTypes";

export interface AdminNavItem {
  href: string;
  key:
    | "overview"
    | "employees"
    | "registrations"
    | "leaveTypes"
    | "leaveRequests"
    | "branches"
    | "departments"
    | "positions"
    | "fingerprintImport";
  icon: LucideIcon;
  match: (pathname: string) => boolean;
  superAdminOnly?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: "/admin-dashboard",
    key: "overview",
    icon: LayoutDashboard,
    match: (pathname) =>
      pathname === "/admin-dashboard" || pathname === "/admin-dashboard/",
  },
  {
    href: "/admin-dashboard/employees",
    key: "employees",
    icon: Users,
    match: (pathname) => pathname.startsWith("/admin-dashboard/employees"),
  },
  {
    href: "/admin-dashboard/branches",
    key: "branches",
    icon: MapPinned,
    match: (pathname) => pathname.startsWith("/admin-dashboard/branches"),
    superAdminOnly: true,
  },
  {
    href: "/admin-dashboard/departments",
    key: "departments",
    icon: Building2,
    match: (pathname) => pathname.startsWith("/admin-dashboard/departments"),
    superAdminOnly: true,
  },
  {
    href: "/admin-dashboard/positions",
    key: "positions",
    icon: Briefcase,
    match: (pathname) => pathname.startsWith("/admin-dashboard/positions"),
    superAdminOnly: true,
  },
  {
    href: "/admin-dashboard/leave-types",
    key: "leaveTypes",
    icon: ClipboardList,
    match: (pathname) => pathname.startsWith("/admin-dashboard/leave-types"),
    superAdminOnly: true,
  },
  {
    href: "/admin-dashboard/fingerprint-import",
    key: "fingerprintImport",
    icon: Fingerprint,
    match: (pathname) =>
      pathname.startsWith("/admin-dashboard/fingerprint-import"),
    superAdminOnly: true,
  },
  {
    href: "/admin-dashboard/registrations",
    key: "registrations",
    icon: UserPlus,
    match: (pathname) => pathname.startsWith("/admin-dashboard/registrations"),
  },
  {
    href: "/admin-dashboard/leave-requests",
    key: "leaveRequests",
    icon: CalendarDays,
    match: (pathname) => pathname.startsWith("/admin-dashboard/leave-requests"),
  },
];

export function getAdminNavItemsForRole(role: AdminRole): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter(
    (item) => !item.superAdminOnly || isSuperAdmin(role)
  );
}

export function getAdminPageTitleKey(pathname: string): AdminNavItem["key"] {
  const item = ADMIN_NAV_ITEMS.find((nav) => nav.match(pathname));
  return item?.key ?? "overview";
}

export function isSuperAdminOnlyRoute(pathname: string): boolean {
  return ADMIN_NAV_ITEMS.some(
    (item) => item.superAdminOnly === true && item.match(pathname)
  );
}

export const ADMIN_SUPER_ADMIN_REDIRECT_PATH = "/admin-dashboard";
