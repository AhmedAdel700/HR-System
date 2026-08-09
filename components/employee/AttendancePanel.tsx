"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MainButton } from "@/components/shared/MainButton";
import {
  attendanceStatusSurface,
  demoAttendanceWeek,
  type AttendanceStatus,
} from "@/lib/employee/demo-data";
import { cn } from "@/lib/utils";

type TodayState = "idle" | "in" | "out";

function formatNow() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function AttendancePanel() {
  const t = useTranslations("employee.attendance");
  const [state, setState] = useState<TodayState>("idle");
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  const statusLabel = useMemo(() => {
    if (state === "out") return t("checkedOut");
    if (state === "in") return t("checkedIn");
    return t("notStarted");
  }, [state, t]);

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {t("today")}
        </p>
        <p className="mt-2 text-lg font-semibold text-ink">{statusLabel}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-surface-muted px-3 py-2.5">
            <p className="text-xs text-text-muted">{t("inAt")}</p>
            <p className="mt-0.5 font-medium text-ink">{checkIn ?? "—"}</p>
          </div>
          <div className="rounded-xl bg-surface-muted px-3 py-2.5">
            <p className="text-xs text-text-muted">{t("outAt")}</p>
            <p className="mt-0.5 font-medium text-ink">{checkOut ?? "—"}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <MainButton
            variant="primary"
            block
            disabled={state !== "idle"}
            onClick={() => {
              setCheckIn(formatNow());
              setState("in");
            }}
          >
            {t("checkIn")}
          </MainButton>
          <MainButton
            variant="neutral"
            block
            disabled={state !== "in"}
            onClick={() => {
              setCheckOut(formatNow());
              setState("out");
            }}
          >
            {t("checkOut")}
          </MainButton>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">{t("thisWeek")}</h2>
        <ul className="space-y-2">
          {demoAttendanceWeek.map((day) => (
            <li
              key={day.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-3 shadow-xs"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{day.date}</p>
                <p className="text-xs text-text-muted">
                  {day.checkIn || day.checkOut
                    ? `${day.checkIn ?? "—"} → ${day.checkOut ?? "—"}`
                    : "—"}
                </p>
              </div>
              <StatusChip status={day.status} label={t(`status.${day.status}`)} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatusChip({
  status,
  label,
}: {
  status: AttendanceStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
        attendanceStatusSurface[status]
      )}
    >
      {label}
    </span>
  );
}
