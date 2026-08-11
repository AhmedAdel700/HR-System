"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/auth/LocaleSwitcher";
import { MainButton } from "@/components/shared/MainButton";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  AdminMobileNavProvider,
  useAdminMobileNav,
} from "@/lib/admin/adminMobileNav";
import { getAdminPageTitleKey } from "@/lib/admin/adminNav";
import { cn } from "@/lib/utils";

function AdminShellHeader(): React.ReactElement {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const pageKey = getAdminPageTitleKey(pathname);
  const { setOpen } = useAdminMobileNav();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-6">
        <div className="inline-flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-500 text-[10px] font-semibold text-text-inverse shadow-primary-sm">
            AD
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink lg:text-base">
              {t(`nav.${pageKey}`)}
            </p>
            <p className="truncate text-[11px] text-text-muted lg:text-xs">
              {t("brand")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher tone="light" />
          <MainButton
            type="button"
            variant="neutral"
            size="sm"
            iconOnly
            aria-label={t("sidebar.openMenu")}
            className="size-9 border-border bg-surface-muted text-text-secondary hover:border-border hover:bg-primary-50 hover:text-primary-700 lg:hidden"
            onClick={() => setOpen(true)}
            startIcon={<Menu className="size-5" strokeWidth={1.75} />}
          />
        </div>
      </div>
    </header>
  );
}

export function AdminShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <AdminMobileNavProvider>
      <div className={cn("relative min-h-dvh bg-surface-sunken", className)}>
        <AdminShellHeader />

        <div className="flex w-full items-start">
          <AdminSidebar />
          <main className="min-w-0 flex-1 px-4 py-5 lg:px-6 lg:py-6">
            {children}
          </main>
        </div>
      </div>
    </AdminMobileNavProvider>
  );
}
