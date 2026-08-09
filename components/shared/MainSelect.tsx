"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type MainSelectOption = {
  value: string;
  label: string;
};

export type MainSelectProps = {
  label?: string;
  hint?: string;
  error?: string;
  startIcon?: React.ReactNode;
  containerClassName?: string;
  placeholder?: string;
  options: MainSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function MainSelect({
  label,
  hint,
  error,
  startIcon,
  containerClassName,
  placeholder,
  options,
  value,
  defaultValue,
  onValueChange,
  onBlur,
  name,
  id,
  disabled,
  required,
  className,
}: MainSelectProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const invalid = Boolean(error);

  const items = React.useMemo(
    () =>
      options.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    [options]
  );

  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

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

      <Select
        items={items}
        value={value === "" || value == null ? null : value}
        defaultValue={
          defaultValue === "" || defaultValue == null ? null : defaultValue
        }
        onValueChange={(next) => {
          onValueChange?.(typeof next === "string" ? next : "");
        }}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={fieldId}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onBlur={onBlur}
          className={cn(
            "relative h-10 w-full min-w-0 rounded-md border-border bg-surface px-3 text-sm text-text shadow-none",
            "focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/25",
            "aria-invalid:border-danger-500 aria-invalid:ring-2 aria-invalid:ring-danger-500/20",
            "data-placeholder:text-text-muted",
            startIcon && "ps-10",
            className
          )}
        >
          {startIcon ? (
            <span
              className="pointer-events-none absolute start-0 top-0 z-10 flex h-full w-10 items-center justify-center text-text-muted [&_svg]:size-4"
              aria-hidden="true"
            >
              {startIcon}
            </span>
          ) : null}
          <SelectValue>
            {(selected: string | null) => {
              if (selected == null || selected === "") {
                return placeholder ?? "";
              }
              return (
                options.find((option) => option.value === selected)?.label ??
                selected
              );
            }}
          </SelectValue>
        </SelectTrigger>

        <SelectContent
          alignItemWithTrigger={false}
          align="start"
          className="rounded-md border border-border bg-surface text-text shadow-md ring-border"
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-md focus:bg-primary-50 focus:text-primary-800"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

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
