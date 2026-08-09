"use client";

import { CalendarClock, FileText, Home, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/",
    key: "home",
    icon: Home,
    match: (p: string) => p === "/" || p === "",
  },
  {
    href: "/attendance",
    key: "attendance",
    icon: CalendarClock,
    match: (p: string) => p.startsWith("/attendance"),
  },
  {
    href: "/requests",
    key: "requests",
    icon: FileText,
    match: (p: string) => p.startsWith("/requests"),
  },
  {
    href: "/profile",
    key: "profile",
    icon: UserRound,
    match: (p: string) => p.startsWith("/profile"),
  },
] as const;

export function EmployeeTabBar() {
  const t = useTranslations("employee.tabs");
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Employee"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 pt-2">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-text-muted hover:bg-surface-muted hover:text-text-secondary"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn("size-5", active ? "text-primary-600" : "text-current")}
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span>{t(tab.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
