"use client";

import { useMemo, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import {
  LEAVE_BALANCE_GROUPS,
  leaveBalanceDot,
  leaveTypeSurface,
  type LeaveBalanceKey,
} from "@/lib/employee/demo-data";
import {
  getEmployeeLeaveBalance,
  getLeaveUsagePercent,
  type LeaveBalanceStat,
} from "@/lib/employee/leaveBalance";
import { cn } from "@/lib/utils";

interface LeaveBalanceGroupsListProps {
  employeeId: string;
}

export function LeaveBalanceGroupsList({
  employeeId,
}: LeaveBalanceGroupsListProps): ReactElement {
  const t = useTranslations("employee.leave");

  const stats = useMemo(
    () => getEmployeeLeaveBalance(employeeId),
    [employeeId]
  );
  const statsByKey = useMemo(
    () =>
      Object.fromEntries(stats.map((item) => [item.key, item])) as Record<
        LeaveBalanceKey,
        LeaveBalanceStat
      >,
    [stats]
  );

  return (
    <div className="space-y-5">
      {LEAVE_BALANCE_GROUPS.map((group) => (
        <section key={group.id}>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t(`groups.${group.id}`)}
          </h3>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {group.keys.map((key) => (
              <LeaveBalanceCard
                key={key}
                stat={statsByKey[key]}
                typeLabel={t(`types.${key}`)}
                usedLabel={t("usedLabel")}
                remainingLabel={t("remainingLabel")}
                unitLabel={t(`units.${statsByKey[key].unit}`)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

interface LeaveBalanceCardProps {
  stat: LeaveBalanceStat;
  typeLabel: string;
  usedLabel: string;
  remainingLabel: string;
  unitLabel: string;
}

function LeaveBalanceCard({
  stat,
  typeLabel,
  usedLabel,
  remainingLabel,
  unitLabel,
}: LeaveBalanceCardProps): ReactElement {
  const usagePercent = getLeaveUsagePercent(stat);
  const surface = leaveTypeSurface[stat.key];

  return (
    <li className="rounded-xl border border-border/80 bg-surface p-3 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-lg",
              surface.soft
            )}
            aria-hidden
          >
            <span className={cn("size-2.5 rounded-full", leaveBalanceDot[stat.key])} />
          </span>
          <p className="truncate text-sm font-medium text-ink">{typeLabel}</p>
        </div>
        <p className="shrink-0 text-end text-[11px] tabular-nums text-text-muted">
          {stat.used + stat.remaining} {unitLabel}
        </p>
      </div>

      <div className="mt-3">
        <div
          className="h-1.5 overflow-hidden rounded-full bg-neutral-100"
          role="progressbar"
          aria-valuenow={usagePercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${usedLabel}: ${stat.used} ${unitLabel}`}
        >
          <div
            className={cn("h-full rounded-full transition-[width]", leaveBalanceDot[stat.key])}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border/70 bg-surface-muted/40 px-2.5 py-2">
          <dt className="text-[11px] font-medium text-text-muted">{usedLabel}</dt>
          <dd className="mt-0.5 tabular-nums">
            <span className="text-base font-semibold text-ink">{stat.used}</span>
            <span className="ms-1 text-xs text-text-muted">{unitLabel}</span>
          </dd>
        </div>
        <div className="rounded-lg border border-border/70 bg-surface-muted/40 px-2.5 py-2">
          <dt className="text-[11px] font-medium text-text-muted">{remainingLabel}</dt>
          <dd className="mt-0.5 tabular-nums">
            <span className={cn("text-base font-semibold", surface.strong)}>
              {stat.remaining}
            </span>
            <span className="ms-1 text-xs text-text-muted">{unitLabel}</span>
          </dd>
        </div>
      </dl>
    </li>
  );
}
