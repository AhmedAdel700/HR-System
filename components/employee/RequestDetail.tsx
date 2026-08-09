import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getDemoRequest,
  leaveTypeSurface,
} from "@/lib/employee/demo-data";
import { cn } from "@/lib/utils";

export async function RequestDetail({ id }: { id: string }) {
  const t = await getTranslations("employee.requests");
  const item = getDemoRequest(id);

  if (!item) notFound();

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              leaveTypeSurface[item.type].soft
            )}
          >
            {t(`types.${item.type}`)}
          </span>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              item.status === "pending" && "bg-warning-50 text-warning-700",
              item.status === "approved" && "bg-success-50 text-success-700",
              item.status === "rejected" && "bg-danger-50 text-danger-700"
            )}
          >
            {t(`status.${item.status}`)}
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          {t("detail")}
        </h1>
      </section>

      <dl className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <div>
          <dt className="text-xs text-text-muted">{t("dates")}</dt>
          <dd className="mt-1 text-sm font-medium text-ink">
            {item.from === item.to ? item.from : `${item.from} → ${item.to}`}
          </dd>
        </div>
        {item.startTime && item.endTime ? (
          <div>
            <dt className="text-xs text-text-muted">{t("hours")}</dt>
            <dd className="mt-1 text-sm font-medium text-ink">
              {item.startTime} → {item.endTime}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs text-text-muted">{t("reason")}</dt>
          <dd className="mt-1 text-sm text-text-secondary">{item.reason}</dd>
        </div>
        {item.note ? (
          <div>
            <dt className="text-xs text-text-muted">{t("note")}</dt>
            <dd className="mt-1 text-sm text-text-secondary">{item.note}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs text-text-muted">{t("createdAt")}</dt>
          <dd className="mt-1 text-sm font-medium text-ink">{item.createdAt}</dd>
        </div>
      </dl>

      <Link
        href="/requests"
        className="inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        {t("back")}
      </Link>
    </div>
  );
}
