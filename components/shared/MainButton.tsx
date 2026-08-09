"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export interface MainButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant" | "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
  iconOnly?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  link?: string;
  target?: string;
}

export const MainButton = React.forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      block = false,
      iconOnly = false,
      startIcon,
      endIcon,
      children,
      disabled,
      link,
      target,
      ...props
    },
    ref
  ) => {
    const resolvedSize =
      iconOnly &&
      (size === "sm" ||
        size === "md" ||
        size === "lg" ||
        size === "xl" ||
        size === "default" ||
        size === "xs")
        ? size === "sm"
          ? "icon-sm"
          : size === "lg"
            ? "icon-lg"
            : size === "xl"
              ? "icon-xl"
              : size === "xs"
                ? "icon-xs"
                : "icon"
        : size;

    const content = (
      <>
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          startIcon
        )}
        {children}
        {!loading && endIcon}
      </>
    );

    const sharedClassName = cn(className);
    const isDisabled = disabled || loading;

    if (link) {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={resolvedSize}
          block={block}
          nativeButton={false}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled ? "true" : undefined}
          data-icon-only={iconOnly ? "" : undefined}
          className={sharedClassName}
          render={
            <Link
              href={link}
              target={target}
              rel={target === "_blank" ? "noopener noreferrer" : undefined}
            />
          }
          onClick={(event) => {
            if (isDisabled) {
              event.preventDefault();
              return;
            }
            props.onClick?.(event);
          }}
          {...props}
        >
          {content}
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={resolvedSize}
        block={block}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-icon-only={iconOnly ? "" : undefined}
        className={sharedClassName}
        {...props}
      >
        {content}
      </Button>
    );
  }
);

MainButton.displayName = "MainButton";
