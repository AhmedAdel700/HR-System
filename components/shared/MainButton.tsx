"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

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
    const resolvedSize = iconOnly
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

    const isDisabled = Boolean(disabled || loading);

    const sharedProps = {
      ref,
      variant,
      size: resolvedSize,
      block: block || undefined,
      disabled: isDisabled,
      "aria-busy": loading || undefined,
      className: className || undefined,
      ...props,
    } as const;

    if (link) {
      return (
        <Button
          {...sharedProps}
          nativeButton={false}
          aria-disabled={isDisabled || undefined}
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
        >
          {content}
        </Button>
      );
    }

    return <Button {...sharedProps}>{content}</Button>;
  }
);

MainButton.displayName = "MainButton";
