"use client";

import type { ReactElement } from "react";
import { MainButton } from "@/components/shared/MainButton";
import { cn } from "@/lib/utils";

export interface ModalBackdropProps {
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  position?: "fixed" | "absolute";
  className?: string;
}

export function ModalBackdrop({
  ariaLabel,
  onClick,
  disabled = false,
  position = "fixed",
  className,
}: ModalBackdropProps): ReactElement {
  return (
    <MainButton
      type="button"
      variant="ghost"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        position === "fixed" ? "fixed inset-0" : "absolute inset-0",
        "h-auto min-h-0 w-auto min-w-0 cursor-pointer rounded-none border-0 bg-ink/50 p-0 shadow-none",
        "hover:bg-ink/50 active:translate-y-0 focus-visible:ring-0",
        className
      )}
    />
  );
}
