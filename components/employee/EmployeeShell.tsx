"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { EmployeeTabBar } from "@/components/employee/EmployeeTabBar";
import { cn } from "@/lib/utils";

export function EmployeeShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations("employee");
  const pathname = usePathname();

  let title = t("tabs.home");
  if (pathname.startsWith("/attendance")) title = t("attendance.title");
  else if (pathname.startsWith("/requests/new")) title = t("requests.new");
  else if (/^\/requests\/[^/]+$/.test(pathname)) title = t("requests.detail");
  else if (pathname.startsWith("/requests")) title = t("requests.title");
  else if (pathname.startsWith("/profile")) title = t("profile.title");

  return (
    <div className={cn("relative min-h-dvh bg-surface-sunken", className)}>
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-3 px-4">
          <div className="inline-flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-500 text-[10px] font-semibold text-text-inverse shadow-primary-sm">
              HR
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{title}</p>
              <p className="truncate text-[11px] text-text-muted">{t("brand")}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 pb-28 pt-5">{children}</main>

      <EmployeeTabBar />
    </div>
  );
}
