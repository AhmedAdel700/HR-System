"use client";

import { useEffect, type ReactNode, type ReactElement } from "react";

export function AdminDashboardRoot({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  useEffect(() => {
    document.documentElement.classList.add("admin-dashboard");
    return () => {
      document.documentElement.classList.remove("admin-dashboard");
    };
  }, []);

  return <>{children}</>;
}
