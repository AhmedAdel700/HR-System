"use client";

import { useMemo, useState, useSyncExternalStore, type ReactElement } from "react";
import { useLocale, useTranslations } from "next-intl";
import { arSA, enUS } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { MainButton } from "@/components/shared/MainButton";
import {
  getEmployeeAttendanceHistoryMonths,
  MOCK_ATTENDANCE_HISTORY_MONTHS,
  countMarks,
  parseISODateLocal,
  type AttendanceHistoryMark,
  type AttendanceHistoryMonth,
} from "@/lib/employee/attendanceHistory";
import {
  getRequestsSnapshot,
  subscribeRequests,
} from "@/lib/employee/requestsStore";
import { cn } from "@/lib/utils";

const MARK_CELL_CLASS: Record<AttendanceHistoryMark, string> = {
  worked:
    "[&_button]:bg-attendance-present-50 [&_button]:text-attendance-present-700 [&_button]:hover:bg-attendance-present-50 [&_button]:hover:text-attendance-present-700",
  remote:
    "[&_button]:bg-attendance-remote-50 [&_button]:text-attendance-remote-700 [&_button]:hover:bg-attendance-remote-50 [&_button]:hover:text-attendance-remote-700",
  absent:
    "[&_button]:bg-attendance-absent-50 [&_button]:text-attendance-absent-700 [&_button]:hover:bg-attendance-absent-50 [&_button]:hover:text-attendance-absent-700",
  off: "[&_button]:bg-attendance-holiday-50 [&_button]:text-attendance-holiday-700 [&_button]:hover:bg-attendance-holiday-50 [&_button]:hover:text-attendance-holiday-700",
};

function formatMonthLabel(key: string, locale: string): string {
  const [yearRaw, monthRaw] = key.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return key;

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function MonthAttendanceCalendar({
  month,
}: {
  month: AttendanceHistoryMonth;
}): ReactElement {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const dayPickerLocale = isRtl ? arSA : enUS;
  const monthDate = useMemo(
    () => new Date(month.year, month.month - 1, 1),
    [month.month, month.year]
  );

  const modifiers = useMemo(() => {
    const worked: Date[] = [];
    const remote: Date[] = [];
    const absent: Date[] = [];
    const off: Date[] = [];

    for (const day of month.days) {
      const date = parseISODateLocal(day.date);
      if (!date) continue;
      if (day.mark === "worked") worked.push(date);
      else if (day.mark === "remote") remote.push(date);
      else if (day.mark === "absent") absent.push(date);
      else off.push(date);
    }

    return { worked, remote, absent, off };
  }, [month.days]);

  return (
    <Calendar
      mode="single"
      month={monthDate}
      onMonthChange={() => undefined}
      selected={undefined}
      onSelect={() => undefined}
      disableNavigation
      locale={dayPickerLocale}
      dir={isRtl ? "rtl" : "ltr"}
      modifiers={modifiers}
      modifiersClassNames={{
        worked: MARK_CELL_CLASS.worked,
        remote: MARK_CELL_CLASS.remote,
        absent: MARK_CELL_CLASS.absent,
        off: MARK_CELL_CLASS.off,
      }}
      className="w-full bg-transparent p-0 [--cell-size:2.5rem]"
      classNames={{
        root: "w-full",
        months: "relative flex w-full flex-col",
        month: "flex w-full flex-col gap-1",
        month_caption: "hidden",
        nav: "hidden",
        weekdays: "flex w-full gap-0.5",
        weekday:
          "flex h-(--cell-size) flex-1 items-center justify-center text-[0.7rem] font-medium text-text-muted",
        week: "mt-0.5 flex w-full gap-0.5",
        day: "group/day relative h-(--cell-size) flex-1 p-0 text-center",
        outside: "opacity-30",
        today: "rounded-md",
      }}
    />
  );
}

interface AttendanceHistorySectionProps {
  months?: readonly AttendanceHistoryMonth[];
  employeeId?: string;
}

const DEMO_ATTENDANCE_FROM = new Date(2026, 7, 10);
const DEMO_ATTENDANCE_MONTH_COUNT = 4;

export function AttendanceHistorySection({
  months: monthsProp,
  employeeId,
}: AttendanceHistorySectionProps): ReactElement {
  const t = useTranslations("employee.home.attendanceHistory");
  const locale = useLocale();

  useSyncExternalStore(subscribeRequests, getRequestsSnapshot, getRequestsSnapshot);
  const requests = getRequestsSnapshot();

  const months = useMemo(() => {
    if (monthsProp) return monthsProp;
    if (employeeId) {
      return getEmployeeAttendanceHistoryMonths(
        employeeId,
        DEMO_ATTENDANCE_MONTH_COUNT,
        DEMO_ATTENDANCE_FROM,
        requests
      );
    }
    return MOCK_ATTENDANCE_HISTORY_MONTHS;
  }, [monthsProp, employeeId, requests]);

  const [openMonths, setOpenMonths] = useState<ReadonlySet<string>>(
    () => new Set(months[0] ? [months[0].key] : [])
  );

  const toggleMonth = (key: string): void => {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section className="space-y-3">
      <div className="space-y-1.5">
        <h2 className="text-base font-bold text-ink">{t("title")}</h2>
        <p className="text-sm font-medium text-text-secondary">{t("subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm font-medium text-text-secondary">
        <LegendSwatch
          className="bg-attendance-present-50 text-attendance-present-700"
          label={t("legendWorked")}
        />
        <LegendSwatch
          className="bg-attendance-remote-50 text-attendance-remote-700"
          label={t("legendRemote")}
        />
        <LegendSwatch
          className="bg-attendance-absent-50 text-attendance-absent-700"
          label={t("legendAbsent")}
        />
        <LegendSwatch
          className="bg-attendance-holiday-50 text-attendance-holiday-700"
          label={t("legendOff")}
        />
      </div>

      <div className="space-y-3">
        {months.map((month) => {
          const isOpen = openMonths.has(month.key);
          const panelId = `attendance-history-${month.key}`;
          const counts = countMarks(month.days);

          return (
            <div
              key={month.key}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <MainButton
                type="button"
                variant="ghost"
                block
                onClick={() => toggleMonth(month.key)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                endIcon={
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-text-muted transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                }
                className={cn(
                  "h-auto w-full justify-between gap-3 rounded-none border-0 px-3 py-2.5 text-start font-normal shadow-none ring-0",
                  "bg-surface hover:bg-surface-muted/40"
                )}
              >
                <span className="min-w-0 text-start">
                  <span className="block text-sm font-semibold text-ink">
                    {formatMonthLabel(month.key, locale)}
                  </span>
                  <span className="text-xs text-text-muted">
                    {t("monthSummary", {
                      worked: counts.worked + counts.remote,
                      absent: counts.absent,
                    })}
                  </span>
                </span>
              </MainButton>

              {isOpen ? (
                <div
                  id={panelId}
                  className="border-t border-border bg-surface px-2 py-2"
                >
                  <MonthAttendanceCalendar month={month} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LegendSwatch({
  className,
  label,
}: {
  className: string;
  label: string;
}): ReactElement {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "grid size-6 place-items-center rounded-md text-[11px] font-semibold",
          className
        )}
        aria-hidden
      >
        12
      </span>
      <span>{label}</span>
    </span>
  );
}
