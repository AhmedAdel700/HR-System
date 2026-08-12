"use client";

import { type ReactElement } from "react";
import { MainButton, type ButtonVariant } from "@/components/shared/MainButton";
import { cn } from "@/lib/utils";

export interface ModalFormActionsProps {
  cancelLabel: string;
  onCancel: () => void;
  submitLabel: string;
  submitType?: "button" | "submit";
  onSubmit?: () => void;
  loading?: boolean;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  submitVariant?: ButtonVariant;
  className?: string;
}

export function ModalFormActions({
  cancelLabel,
  onCancel,
  submitLabel,
  submitType = "submit",
  onSubmit,
  loading = false,
  submitDisabled = false,
  cancelDisabled = false,
  submitVariant = "primary",
  className,
}: ModalFormActionsProps): ReactElement {
  return (
    <div className={cn("grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2", className)}>
      <MainButton
        variant={submitVariant}
        block
        type={submitType}
        loading={loading}
        disabled={submitDisabled}
        onClick={onSubmit}
        className="order-1 sm:order-2"
      >
        {submitLabel}
      </MainButton>
      <MainButton
        variant="neutral"
        block
        type="button"
        disabled={cancelDisabled || loading}
        onClick={onCancel}
        className="order-2 sm:order-1"
      >
        {cancelLabel}
      </MainButton>
    </div>
  );
}
