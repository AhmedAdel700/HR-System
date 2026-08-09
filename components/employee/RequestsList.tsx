"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import {
  demoRequests,
  leaveTypeSurface,
  type RequestStatus,
} from "@/lib/employee/demo-data";
import { cn } from "@/lib/utils";

const filters: Array<"all" | RequestStatus> = [
  "all",
  "pending",
  "approved",
  "rejected",
];

export function RequestsList() {
  const t = useTranslations("employee.requests");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const items = useMemo(
    () =>
      filter === "all"
        ? demoRequests
        : demoRequests.filter((item) => item.status === filter),
    [filter]
  );

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

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((key) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-ink text-text-inverse"
                  : "bg-surface text-text-secondary ring-1 ring-border hover:bg-surface-muted"
              )}
            >
              {t(`filter.${key}`)}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-text-muted">
          {t("empty")}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
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
                  <StatusBadge status={item.status} label={t(`status.${item.status}`)} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
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
