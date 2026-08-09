import { getTranslations } from "next-intl/server";
import { CalendarClock, FilePlus2, Files } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AttendanceHistorySection } from "@/components/employee/AttendanceHistorySection";
import { MainButton } from "@/components/shared/MainButton";
import { demoRequests } from "@/lib/employee/demo-data";

export async function EmployeeHome() {
  const t = await getTranslations("employee");
  const openCount = demoRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("home.greeting")}
        </h1>
        <p className="text-sm text-text-secondary">{t("home.subtitle")}</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-ink">
            {t("home.todayAttendance")}
          </h2>
          <CalendarClock className="size-4 text-text-muted" />
        </div>
        <p className="text-sm text-text-secondary">{t("home.notCheckedIn")}</p>
        <p className="mt-2 text-xs text-text-muted">{t("home.attendanceNote")}</p>
        <div className="mt-4">
          <MainButton variant="primary" block link="/attendance">
            {t("home.goAttendance")}
          </MainButton>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">{t("home.quickActions")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/requests/new"
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-colors hover:border-primary-200 hover:bg-primary-50/40"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary-500 text-text-inverse shadow-primary-sm">
              <FilePlus2 className="size-5" />
            </span>
            <span className="text-sm font-medium text-ink">{t("home.newRequest")}</span>
          </Link>
          <Link
            href="/requests"
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-xs transition-colors hover:border-border-strong hover:bg-surface-muted"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-text-inverse">
              <Files className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink">
                {t("home.myRequests")}
              </span>
              <span className="text-xs text-text-muted">
                {t("home.openRequests", { count: openCount })}
              </span>
            </span>
          </Link>
        </div>
      </section>

      <AttendanceHistorySection />
    </div>
  );
}
