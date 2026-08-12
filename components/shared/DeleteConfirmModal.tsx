"use client";

import type { ReactElement } from "react";
import { type ButtonVariant } from "@/components/shared/MainButton";
import { ModalFormActions } from "@/components/shared/ModalFormActions";
import { ModalShell } from "@/components/shared/ModalShell";

export interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmVariant?: ButtonVariant;
}

export function DeleteConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
  confirmVariant = "delete",
}: DeleteConfirmModalProps): ReactElement | null {
  return (
    <ModalShell
      open={open}
      onClose={onCancel}
      backdropAriaLabel={cancelLabel}
      backdropDisabled={loading}
      layout="center"
      role="alertdialog"
      ariaModal
      ariaLabelledBy="delete-confirm-title"
      ariaDescribedBy="delete-confirm-description"
      panelClassName="max-w-sm overflow-hidden"
    >
      <h2
        id="delete-confirm-title"
        className="text-base font-semibold text-ink"
      >
        {title}
      </h2>
      <p
        id="delete-confirm-description"
        className="mt-2 text-sm text-text-secondary"
      >
        {description}
      </p>
      <ModalFormActions
        className="mt-4 pt-0"
        cancelLabel={cancelLabel}
        onCancel={onCancel}
        submitLabel={confirmLabel}
        submitType="button"
        onSubmit={onConfirm}
        loading={loading}
        cancelDisabled={loading}
        submitVariant={confirmVariant}
      />
    </ModalShell>
  );
}
