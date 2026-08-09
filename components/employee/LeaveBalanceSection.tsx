import { getTranslations } from "next-intl/server";
import {
  LEAVE_BALANCE,
  LEAVE_BALANCE_GROUPS,
  leaveBalanceDot,
  type LeaveBalanceKey,
} from "@/lib/employee/demo-data";
import { cn } from "@/lib/utils";

const balanceByKey = Object.fromEntries(
  LEAVE_BALANCE.map((item) => [item.key, item])
) as Record<LeaveBalanceKey, (typeof LEAVE_BALANCE)[number]>;

export async function LeaveBalanceSection() {
  const t = await getTranslations("employee.leave");

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
      <div className="mb-4 space-y-1">
        <h2 className="text-sm font-semibold text-ink">{t("title")}</h2>
        <p className="text-xs text-text-muted lg:text-sm">{t("subtitle")}</p>
      </div>

      <div className="space-y-4">
        {LEAVE_BALANCE_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">
              {t(`groups.${group.id}`)}
            </p>
            <ul className="overflow-hidden rounded-xl border border-border bg-surface-muted/50">
              {group.keys.map((key, index) => {
                const item = balanceByKey[key];

                return (
                  <li
                    key={key}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2.5",
                      index > 0 && "border-t border-border"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          leaveBalanceDot[key]
                        )}
                        aria-hidden
                      />
                      <span className="truncate text-sm text-ink lg:text-base">
                        {t(`types.${key}`)}
                      </span>
                    </div>
                    <p className="shrink-0 text-end">
                      <span className="text-sm font-semibold tabular-nums text-ink lg:text-base">
                        {item.remaining}
                      </span>
                      <span className="ms-1 text-xs text-text-muted lg:text-sm">
                        {t(`units.${item.unit}`)}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
