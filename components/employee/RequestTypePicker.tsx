import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  REQUEST_TYPES,
  leaveTypeSurface,
} from "@/lib/employee/demo-data";
import { cn } from "@/lib/utils";

export async function RequestTypePicker() {
  const t = await getTranslations("employee.requests");

  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          {t("pickType")}
        </h1>
        <p className="text-sm text-text-secondary">{t("pickTypeSubtitle")}</p>
      </section>

      <ul className="grid gap-3">
        {REQUEST_TYPES.map((type) => (
          <li key={type}>
            <Link
              href={`/requests/new/${type}`}
              className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-colors hover:border-border-strong"
            >
              <span
                className={cn(
                  "mt-0.5 size-2.5 shrink-0 rounded-full",
                  leaveTypeSurface[type].solid.split(" ")[0]
                )}
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">
                  {t(`types.${type}`)}
                </span>
                <span className="mt-0.5 block text-xs text-text-secondary">
                  {t(`typeHints.${type}`)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/requests"
        className="inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        {t("back")}
      </Link>
    </div>
  );
}
