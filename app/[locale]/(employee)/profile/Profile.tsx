import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/auth/LocaleSwitcher";
import { LeaveBalanceSection } from "@/components/employee/LeaveBalanceSection";
import { MainButton } from "@/components/shared/MainButton";
import { demoEmployee } from "@/lib/employee/demo-data";

function DetailRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-xs text-text-muted lg:text-base">{label}</dt>
      <dd className="min-w-0 text-end">
        <p className="text-sm font-medium text-ink lg:text-base">{value}</p>
        {hint ? (
          <p className="mt-0.5 text-xs text-text-muted lg:text-sm">{hint}</p>
        ) : null}
      </dd>
    </div>
  );
}

export async function Profile() {
  const t = await getTranslations("employee.profile");
  const tLabel = await getTranslations("employee.profile.labels");

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <Image
            src={demoEmployee.avatarSrc}
            alt={t("name")}
            width={80}
            height={80}
            className="size-20 shrink-0 rounded-2xl object-cover ring-2 ring-primary-100"
          />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-ink">{t("name")}</h1>
            <p className="text-sm text-text-secondary">{t("role")}</p>
            <p className="mt-1 text-xs text-text-muted">
              {tLabel("employeeId")} · {t("employeeIdValue")}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <h2 className="mb-3 text-sm font-semibold text-ink">{tLabel("work")}</h2>
        <dl className="space-y-3">
          <DetailRow label={tLabel("department")} value={t("department")} />
          <DetailRow label={tLabel("branch")} value={t("branch")} />
          <DetailRow
            label={tLabel("lineManager")}
            value={t("lineManager")}
            hint={t("lineManagerRole")}
          />
          <DetailRow label={tLabel("workLocation")} value={t("workLocation")} />
          <DetailRow label={tLabel("workSchedule")} value={t("workSchedule")} />
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <h2 className="mb-3 text-sm font-semibold text-ink">{tLabel("contact")}</h2>
        <dl className="space-y-3">
          <DetailRow label={tLabel("email")} value={t("email")} />
          <DetailRow label={tLabel("phone")} value={t("phone")} />
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <h2 className="mb-3 text-sm font-semibold text-ink">{tLabel("employment")}</h2>
        <dl className="space-y-3">
          <DetailRow
            label={tLabel("employmentType")}
            value={t("employmentType")}
          />
          <DetailRow label={tLabel("joinDate")} value={t("joinDate")} />
        </dl>
      </section>

      <LeaveBalanceSection />

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink">{t("language")}</p>
          <LocaleSwitcher tone="light" />
        </div>
      </section>

      <MainButton variant="delete" block link="/login">
        {t("signOut")}
      </MainButton>
    </div>
  );
}
