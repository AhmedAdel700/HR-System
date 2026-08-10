"use client";

import { useState, useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { CreateLeaveTypeModal } from "@/components/admin/CreateLeaveTypeModal";
import { MainButton } from "@/components/shared/MainButton";
import {
  getLeaveTypesSnapshot,
  subscribeLeaveTypes,
} from "@/lib/admin/leaveTypesStore";
import { leaveBalanceDot } from "@/lib/employee/demo-data";
import type { LeaveBalanceKey } from "@/lib/employee/demo-data";
import { cn } from "@/lib/utils";

function isKnownLeaveBalanceKey(value: string): value is LeaveBalanceKey {
  return value in leaveBalanceDot;
}

export function AdminLeaveTypesPage(): ReactElement {
  const t = useTranslations("admin.leaveTypesPage");
  const tLeave = useTranslations("employee.leave");

  useSyncExternalStore(
    subscribeLeaveTypes,
    getLeaveTypesSnapshot,
    getLeaveTypesSnapshot
  );

  const leaveTypes = getLeaveTypesSnapshot();
  const [creating, setCreating] = useState(false);

  const columnCount = 4;

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">
            {t("resultsTitle", { count: leaveTypes.length })}
          </p>
          <MainButton
            variant="primary"
            size="sm"
            startIcon={<Plus className="size-4" />}
            onClick={() => setCreating(true)}
          >
            {t("create")}
          </MainButton>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
          <div className="admin-scroll-visible overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.name")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.category")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.unit")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.defaultEntitlement")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveTypes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-4 py-10 text-center text-sm text-text-muted"
                    >
                      {t("empty")}
                    </td>
                  </tr>
                ) : (
                  leaveTypes.map((leaveType) => (
                    <tr
                      key={leaveType.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              isKnownLeaveBalanceKey(leaveType.slug)
                                ? leaveBalanceDot[leaveType.slug]
                                : "bg-brand-500"
                            )}
                            aria-hidden
                          />
                          <span className="font-medium text-ink">
                            {leaveType.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {leaveType.category}
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {tLeave(`units.${leaveType.unit}`)}
                      </td>
                      <td className="px-4 py-3 text-start tabular-nums text-text-secondary">
                        {leaveType.defaultEntitlement}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CreateLeaveTypeModal open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}
