"use client";

import { useEffect, useSyncExternalStore, type ReactElement, type ReactNode } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  ADMIN_SUPER_ADMIN_REDIRECT_PATH,
  isSuperAdminOnlyRoute,
} from "@/lib/admin/adminNav";
import {
  getAdminSessionSnapshot,
  subscribeAdminSession,
} from "@/lib/admin/adminSessionStore";
import { isSuperAdmin } from "@/lib/admin/permissions";

export function AdminSuperAdminGuard({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  const pathname = usePathname();
  const router = useRouter();

  useSyncExternalStore(subscribeAdminSession, getAdminSessionSnapshot, getAdminSessionSnapshot);

  const admin = getAdminSessionSnapshot();
  const requiresSuperAdmin = isSuperAdminOnlyRoute(pathname);
  const isAllowed = !requiresSuperAdmin || isSuperAdmin(admin.role);

  useEffect(() => {
    if (!requiresSuperAdmin || isSuperAdmin(admin.role)) return;
    router.replace(ADMIN_SUPER_ADMIN_REDIRECT_PATH);
  }, [admin.role, pathname, requiresSuperAdmin, router]);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
