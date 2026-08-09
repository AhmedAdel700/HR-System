import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/auth/LocaleSwitcher";
import { MainButton } from "@/components/shared/MainButton";

export async function Profile() {
  const t = await getTranslations("employee.profile");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-500 text-lg font-semibold text-text-inverse shadow-primary-sm">
            SA
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-ink">{t("name")}</h1>
            <p className="text-sm text-text-secondary">{t("role")}</p>
            <p className="text-xs text-text-muted">{t("department")}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-text-muted">{t("demoNote")}</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink">{t("language")}</p>
          <LocaleSwitcher tone="light" />
        </div>
      </section>

      <MainButton variant="neutral" block link="/login">
        {t("signOut")}
      </MainButton>
    </div>
  );
}
