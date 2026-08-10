"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import {
  leaveTypeSurface,
  type DemoRequest,
  type RequestStatus,
} from "@/lib/employee/demo-data";
import {
  formatRequestMonthLabel,
  groupRequestsByMonth,
} from "@/lib/employee/groupRequestsByMonth";
import {
  getEmployeeRequestsSnapshot,
  subscribeRequests,
} from "@/lib/employee/requestsStore";
import { cn } from "@/lib/utils";

export function RequestsList() {
  const t = useTranslations("employee.requests");
  const locale = useLocale();
  const requests = useSyncExternalStore(
    subscribeRequests,
    getEmployeeRequestsSnapshot,
    getEmployeeRequestsSnapshot
  );
  const monthGroups = useMemo(
    () => groupRequestsByMonth(requests),
    [requests]
  );

  const [openMonths, setOpenMonths] = useState<ReadonlySet<string>>(() => {
    const newest = groupRequestsByMonth(getEmployeeRequestsSnapshot())[0]?.key;
    return newest ? new Set([newest]) : new Set();
  });

  const toggleMonth = (key: string): void => {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            {t("title")}
          </h1>
          <p className="text-sm text-text-secondary">{t("subtitle")}</p>
        </div>
        <MainButton
          variant="primary"
          size="sm"
          link="/requests/new"
          startIcon={<Plus className="size-4" />}
        >
          {t("new")}
        </MainButton>
      </section>

      {monthGroups.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-text-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="space-y-5">
          {monthGroups.map((group) => {
            const isOpen = openMonths.has(group.key);
            const panelId = `requests-month-${group.key}`;

            return (
              <section key={group.key} className="space-y-3">
                <button
                  type="button"
                  onClick={() => toggleMonth(group.key)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start transition-colors",
                    isOpen
                      ? "bg-transparent"
                      : "bg-surface-muted hover:bg-neutral-200/70"
                  )}
                >
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="text-sm font-semibold text-ink">
                      {formatRequestMonthLabel(group.key, locale)}
                    </span>
                    <span className="text-xs text-text-muted">
                      {t("monthCount", { count: group.items.length })}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-text-muted transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden
                  />
                </button>

                {isOpen ? (
                  <ul id={panelId} className="space-y-3">
                    {group.items.map((item) => (
                      <RequestCard key={item.id} item={item} />
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RequestCard({ item }: { item: DemoRequest }) {
  const t = useTranslations("employee.requests");

  return (
    <li>
      <Link
        href={`/requests/${item.id}`}
        className="block rounded-2xl border border-border bg-surface p-4 shadow-xs transition-colors hover:border-border-strong"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                leaveTypeSurface[item.type].soft
              )}
            >
              {t(`types.${item.type}`)}
            </span>
            <p className="text-sm font-medium text-ink">
              {item.from === item.to
                ? item.from
                : `${item.from} → ${item.to}`}
            </p>
            <p className="line-clamp-2 text-xs text-text-secondary">
              {item.reason}
            </p>
          </div>
          <StatusBadge
            status={item.status}
            label={t(`status.${item.status}`)}
          />
        </div>
      </Link>
    </li>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: RequestStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
        status === "pending" && "bg-warning-50 text-warning-700",
        status === "approved" && "bg-success-50 text-success-700",
        status === "rejected" && "bg-danger-50 text-danger-700"
      )}
    >
      {label}
    </span>
  );
}
