"use client";

import { type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import { LeaveBalanceGroupsList } from "@/components/employee/LeaveBalanceGroupsList";

interface LeaveStatsSectionProps {
  employeeId: string;
}

export function LeaveStatsSection({
  employeeId,
}: LeaveStatsSectionProps): ReactElement {
  const tLeave = useTranslations("employee.leave");
  const t = useTranslations("admin.employeeDetailPage.leaveStats");

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      <header className="flex items-center gap-2.5 border-b border-border bg-surface-muted/50 px-4 py-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700">
          <CalendarDays className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ink">{t("title")}</h2>
          <p className="text-xs text-text-secondary">{tLeave("subtitle")}</p>
        </div>
      </header>

      <div className="p-4">
        <LeaveBalanceGroupsList employeeId={employeeId} />
      </div>
    </section>
  );
}
