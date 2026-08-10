"use client";

import { useEffect, type ReactElement, type ReactNode } from "react";
import { hydrateAdminSession } from "@/lib/admin/adminSessionStore";
import { markSidebarPreferenceReady } from "@/lib/admin/useAdminSidebarPreference";

export function AdminProviders({ children }: { children: ReactNode }): ReactElement {
  useEffect(() => {
    hydrateAdminSession();
    markSidebarPreferenceReady();
  }, []);

  return <>{children}</>;
}
