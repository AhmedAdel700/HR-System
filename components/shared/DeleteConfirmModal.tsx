"use client";

import type { ReactElement } from "react";
import { MainButton } from "@/components/shared/MainButton";

export interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
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
}: DeleteConfirmModalProps): ReactElement | null {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        aria-label={cancelLabel}
        className="absolute inset-0 cursor-pointer bg-ink/50"
        onClick={onCancel}
        disabled={loading}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-description"
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-md"
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
        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          <MainButton
            variant="neutral"
            block
            disabled={loading}
            onClick={onCancel}
          >
            {cancelLabel}
          </MainButton>
          <MainButton
            variant="delete"
            block
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </MainButton>
        </div>
      </div>
    </div>
  );
}
