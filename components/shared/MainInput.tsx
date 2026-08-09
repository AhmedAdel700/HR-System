"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type MainInputSize = "sm" | "md" | "lg";

type SharedProps = {
  label?: string;
  hint?: string;
  error?: string;
  size?: MainInputSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
  required?: boolean;
};

type InputModeProps = SharedProps &
  Omit<React.ComponentProps<"input">, "size"> & {
    as?: "input";
  };

type TextareaModeProps = SharedProps &
  React.ComponentProps<"textarea"> & {
    as: "textarea";
    type?: never;
  };

export type MainInputProps = InputModeProps | TextareaModeProps;

/** All single-line inputs share one height */
const INPUT_HEIGHT = "h-10";

const sizeClasses: Record<
  MainInputSize,
  { text: string; iconBox: string; padStart: string; padEnd: string }
> = {
  sm: {
    text: "text-xs",
    iconBox: "w-9 [&_svg]:size-3.5",
    padStart: "ps-9",
    padEnd: "pe-9",
  },
  md: {
    text: "text-sm",
    iconBox: "w-10 [&_svg]:size-4",
    padStart: "ps-10",
    padEnd: "pe-10",
  },
  lg: {
    text: "text-sm sm:text-base",
    iconBox: "w-11 [&_svg]:size-4",
    padStart: "ps-11",
    padEnd: "pe-11",
  },
};

export const MainInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  MainInputProps
>(function MainInput(props, ref) {
  const {
    as = "input",
    label,
    hint,
    error,
    size = "md",
    startIcon,
    endIcon,
    containerClassName,
    className,
    id,
    disabled,
    required,
    ...rest
  } = props;

  const t = useTranslations("forms");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [showPassword, setShowPassword] = React.useState(false);

  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  const isPassword = as === "input" && "type" in rest && rest.type === "password";
  const hasStart = Boolean(startIcon);
  const hasEnd = Boolean(endIcon) || isPassword;
  const sizing = sizeClasses[size];
  const invalid = Boolean(error);

  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldClassName = cn(
    as === "input" && INPUT_HEIGHT,
    sizing.text,
    hasStart && sizing.padStart,
    hasEnd && sizing.padEnd,
    as === "textarea" && "min-h-24 h-auto py-2.5",
    className
  );

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

      <div className="relative w-full min-w-0">
        {startIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute start-0 top-0 z-10 flex items-center justify-center text-text-muted",
              sizing.iconBox,
              as === "textarea" ? "h-10" : "h-full"
            )}
            aria-hidden="true"
          >
            {startIcon}
          </span>
        ) : null}

        {as === "textarea" ? (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={fieldId}
            disabled={disabled}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={fieldClassName}
            {...(rest as React.ComponentProps<"textarea">)}
          />
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            id={fieldId}
            disabled={disabled}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={fieldClassName}
            {...(rest as Omit<React.ComponentProps<"input">, "size">)}
            type={
              isPassword ? (showPassword ? "text" : "password") : rest.type
            }
          />
        )}

        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setShowPassword((value) => !value)}
            className={cn(
              "absolute end-0 top-0 z-10 flex h-full items-center justify-center text-text-muted transition-colors",
              "hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30",
              "disabled:pointer-events-none disabled:opacity-50",
              sizing.iconBox
            )}
            aria-label={
              showPassword
                ? t.has("hidePassword")
                  ? t("hidePassword")
                  : "Hide password"
                : t.has("showPassword")
                  ? t("showPassword")
                  : "Show password"
            }
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        ) : endIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute end-0 top-0 z-10 flex items-center justify-center text-text-muted",
              sizing.iconBox,
              as === "textarea" ? "h-10" : "h-full"
            )}
            aria-hidden="true"
          >
            {endIcon}
          </span>
        ) : null}
      </div>

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
});

MainInput.displayName = "MainInput";
