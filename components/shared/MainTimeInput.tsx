"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MainTimeInputProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  containerClassName?: string;
  className?: string;
}

type DayPeriod = "am" | "pm";

interface ParsedClock {
  hour12: number;
  minute: string;
  period: DayPeriod;
  value24: string;
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

function toValue24(hour12: number, minute: string, period: DayPeriod): string {
  let hour24 = hour12 % 12;
  if (period === "pm") hour24 += 12;
  return `${String(hour24).padStart(2, "0")}:${minute}`;
}

function parseTime(value: string | undefined): ParsedClock | null {
  if (!value) return null;
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hourRaw = match[1];
  const minute = match[2];
  if (!hourRaw || !minute) return null;
  const hour24 = Number(hourRaw);
  const minuteNum = Number(minute);
  if (hour24 < 0 || hour24 > 23 || minuteNum < 0 || minuteNum > 59) {
    return null;
  }

  const period: DayPeriod = hour24 < 12 ? "am" : "pm";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return {
    hour12,
    minute,
    period,
    value24: `${hourRaw}:${minute}`,
  };
}

function formatDisplay(
  parsed: ParsedClock,
  amLabel: string,
  pmLabel: string
): string {
  const periodLabel = parsed.period === "am" ? amLabel : pmLabel;
  return `${parsed.hour12}:${parsed.minute} ${periodLabel}`;
}

function TimeColumn({
  values,
  selected,
  onSelect,
  label,
}: {
  values: readonly string[];
  selected: string | null;
  onSelect: (value: string) => void;
  label: string;
}): React.ReactElement {
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!selected || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>(
      `[data-time-value="${selected}"]`
    );
    active?.scrollIntoView({ block: "center" });
  }, [selected]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <p className="text-center text-[11px] font-semibold text-text-muted">
        {label}
      </p>
      <div
        ref={listRef}
        className="max-h-56 overflow-y-auto rounded-md border border-border bg-surface-muted/40 p-1"
        role="listbox"
        aria-label={label}
      >
        {values.map((item) => {
          const isActive = item === selected;
          return (
            <button
              key={item}
              type="button"
              role="option"
              data-time-value={item}
              aria-selected={isActive}
              onClick={() => onSelect(item)}
              className={cn(
                "mx-0.5 flex w-[calc(100%-4px)] cursor-pointer items-center justify-center rounded-md px-2 py-2 text-sm tabular-nums transition-colors",
                isActive
                  ? "bg-primary-500 font-semibold text-text-inverse"
                  : "text-ink hover:bg-primary-50 hover:text-primary-800"
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MainTimeInput({
  label,
  hint,
  error,
  required,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled,
  id,
  name,
  containerClassName,
  className,
}: MainTimeInputProps): React.ReactElement {
  const locale = useLocale();
  const t = useTranslations("employee.requests");
  const isRtl = locale === "ar";
  const [open, setOpen] = React.useState(false);

  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const invalid = Boolean(error);
  const parsed = parseTime(value);
  const resolvedPlaceholder = placeholder ?? t("pickTime");
  const amLabel = t("am");
  const pmLabel = t("pm");
  const displayValue = parsed
    ? formatDisplay(parsed, amLabel, pmLabel)
    : null;

  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const commit = (
    hour12: number,
    minute: string,
    period: DayPeriod
  ): void => {
    onChange?.(toValue24(hour12, minute, period));
  };

  const setHour = (hourLabel: string): void => {
    const hour12 = Number(hourLabel);
    const minute = parsed?.minute ?? "00";
    const period = parsed?.period ?? "am";
    commit(hour12, minute, period);
  };

  const setMinute = (minute: string): void => {
    const hour12 = parsed?.hour12 ?? 12;
    const period = parsed?.period ?? "am";
    commit(hour12, minute, period);
  };

  const setPeriod = (period: DayPeriod): void => {
    const hour12 = parsed?.hour12 ?? 12;
    const minute = parsed?.minute ?? "00";
    commit(hour12, minute, period);
  };

  const hourValues = HOURS_12.map(String);
  const selectedHour = parsed ? String(parsed.hour12) : null;
  const selectedPeriod = parsed?.period ?? null;

  return (
    <div
      className={cn("flex w-full min-w-0 flex-col gap-1.5", containerClassName)}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {label ? (
        <label
          htmlFor={fieldId}
          className="ms-1 text-xs font-medium text-text-secondary"
        >
          {label}
          {required ? (
            <span className="ms-0.5 text-danger-500" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) onBlur?.();
        }}
      >
        <PopoverTrigger
          id={fieldId}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className={cn(
            "group flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm text-text shadow-none outline-none transition-colors",
            "hover:border-border-strong",
            "focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            open && "border-primary-400 ring-2 ring-primary-500/25",
            invalid &&
              "border-danger-500 ring-2 ring-danger-500/20 focus-visible:border-danger-500 focus-visible:ring-danger-500/20",
            className
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 text-start tabular-nums",
              !displayValue && "text-text-muted"
            )}
          >
            {displayValue ?? resolvedPlaceholder}
          </span>
          <Clock className="size-4 shrink-0 text-text-muted" aria-hidden />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-(--anchor-width) max-w-(--available-width) gap-0 overflow-hidden rounded-md border border-border bg-surface p-0 text-text shadow-md ring-1 ring-border"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border bg-linear-to-br from-primary-50 to-surface px-3 py-2.5">
            <p className="min-w-0 truncate text-sm font-semibold tabular-nums text-ink">
              {displayValue ?? resolvedPlaceholder}
            </p>
            <div
              dir="ltr"
              className="relative isolate flex h-8 w-18 shrink-0 items-stretch rounded-lg border border-border bg-surface-muted p-[2px]"
              role="group"
              aria-label={t("period")}
            >
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-y-[2px] start-[2px] w-[calc(50%-2px)] rounded-md bg-primary-500 shadow-xs transition-transform duration-200 ease-out",
                  selectedPeriod === "pm" && "translate-x-full",
                  !selectedPeriod && "opacity-0"
                )}
              />
              <button
                type="button"
                onClick={() => setPeriod("am")}
                aria-pressed={selectedPeriod === "am"}
                className={cn(
                  "relative z-10 flex flex-1 cursor-pointer items-center justify-center rounded-md text-xs font-semibold transition-colors duration-200",
                  selectedPeriod === "am"
                    ? "text-text-inverse"
                    : "text-text-secondary hover:text-primary-800"
                )}
              >
                {amLabel}
              </button>
              <button
                type="button"
                onClick={() => setPeriod("pm")}
                aria-pressed={selectedPeriod === "pm"}
                className={cn(
                  "relative z-10 flex flex-1 cursor-pointer items-center justify-center rounded-md text-xs font-semibold transition-colors duration-200",
                  selectedPeriod === "pm"
                    ? "text-text-inverse"
                    : "text-text-secondary hover:text-primary-800"
                )}
              >
                {pmLabel}
              </button>
            </div>
          </div>

          <div className="flex gap-2.5 p-2.5">
            <TimeColumn
              label={t("hour")}
              values={hourValues}
              selected={selectedHour}
              onSelect={setHour}
            />
            <TimeColumn
              label={t("minute")}
              values={MINUTES}
              selected={parsed?.minute ?? null}
              onSelect={setMinute}
            />
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-1.5">
            <button
              type="button"
              disabled={!parsed}
              onClick={() => {
                onChange?.("");
              }}
              className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("clearDate")}
            </button>
            <button
              type="button"
              disabled={!parsed}
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("done")}
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {name ? (
        <input type="hidden" name={name} value={value ?? ""} readOnly />
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs text-danger-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
