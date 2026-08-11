"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { arSA, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MainButton } from "@/components/shared/MainButton";
import { cn } from "@/lib/utils";

export interface MainDatePickerProps {
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
  minDate?: Date;
  maxDate?: Date;
  containerClassName?: string;
  className?: string;
}

function parseISODate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }
  return date;
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function MainDatePicker({
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
  minDate,
  maxDate,
  containerClassName,
  className,
}: MainDatePickerProps) {
  const locale = useLocale();
  const t = useTranslations("employee.requests");
  const isRtl = locale === "ar";
  const dayPickerLocale = isRtl ? arSA : enUS;
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(() => selectedOrToday(value));

  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const invalid = Boolean(error);
  const selected = parseISODate(value);

  React.useEffect(() => {
    const next = parseISODate(value);
    if (next) setMonth(next);
  }, [value]);

  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const displayValue = selected
    ? format(selected, "EEEE, d MMMM yyyy", { locale: dayPickerLocale })
    : null;

  const resolvedPlaceholder = placeholder ?? t("pickDate");
  const today = startOfDay(new Date());
  const todayDisabled =
    (minDate != null && today < startOfDay(minDate)) ||
    (maxDate != null && today > startOfDay(maxDate));

  const selectDate = (date: Date | undefined): void => {
    onChange?.(date ? toISODate(date) : "");
    setOpen(false);
    onBlur?.();
  };

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
            "group flex min-h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-none outline-none transition-colors",
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
              "min-w-0 flex-1 whitespace-normal text-start leading-snug",
              !displayValue && "text-text-muted"
            )}
          >
            {displayValue ?? resolvedPlaceholder}
          </span>
          <CalendarIcon
            className="size-4 shrink-0 text-text-muted"
            aria-hidden
          />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-(--anchor-width) max-w-(--available-width) gap-0 overflow-hidden rounded-md border border-border bg-surface p-0 text-text shadow-md ring-1 ring-border"
        >
          <div className="border-b border-border bg-linear-to-br from-primary-50 to-surface px-3 py-2">
            <p className="truncate text-xs font-semibold text-ink">
              {displayValue ?? resolvedPlaceholder}
            </p>
          </div>

          <div className="px-2 py-1.5">
            <Calendar
              mode="single"
              locale={dayPickerLocale}
              dir={isRtl ? "rtl" : "ltr"}
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              captionLayout="label"
              buttonVariant="ghost"
              className="w-full bg-transparent p-0 [--cell-size:2.5rem]"
              classNames={{
                root: "w-full",
                months: "relative flex w-full flex-col",
                month: "flex w-full flex-col gap-1",
                month_caption: "flex h-8 w-full items-center justify-center px-8",
                caption_label: "text-sm font-medium",
                nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
                button_previous: "size-7 p-0",
                button_next: "size-7 p-0",
                weekdays: "flex w-full gap-0.5",
                weekday:
                  "flex h-(--cell-size) flex-1 items-center justify-center text-[0.7rem] font-medium text-text-muted",
                week: "mt-0.5 flex w-full gap-0.5",
                day: "group/day relative h-(--cell-size) flex-1 p-0 text-center",
                today: "rounded-md bg-primary-50 text-primary-700",
              }}
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
              onSelect={(date) => {
                selectDate(date);
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-1.5">
            <MainButton
              type="button"
              variant="ghost-brand"
              size="xs"
              disabled={todayDisabled}
              onClick={() => {
                setMonth(today);
                selectDate(today);
              }}
              className="h-auto px-2 py-1 font-semibold shadow-none"
            >
              {t("today")}
            </MainButton>
            <MainButton
              type="button"
              variant="ghost"
              size="xs"
              disabled={!selected}
              onClick={() => {
                selectDate(undefined);
              }}
              className="h-auto px-2 py-1 font-medium shadow-none"
            >
              {t("clearDate")}
            </MainButton>
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

function selectedOrToday(value: string | undefined): Date {
  return parseISODate(value) ?? new Date();
}
