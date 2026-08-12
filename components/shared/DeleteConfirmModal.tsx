"use client";

import { type ReactElement, type RefObject } from "react";
import { type ButtonVariant } from "@/components/shared/MainButton";
import { ModalFormActions } from "@/components/shared/ModalFormActions";
import { ModalShell } from "@/components/shared/ModalShell";
import { useGenieModalClose } from "@/components/shared/GenieModalShell";

export interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => boolean | void;
  onCancel: () => void;
  loading?: boolean;
  confirmVariant?: ButtonVariant;
  triggerRef?: RefObject<HTMLElement | null>;
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
  triggerRef,
}: DeleteConfirmModalProps): ReactElement | null {
  return (
    <ModalShell
      open={open}
      onClose={onCancel}
      triggerRef={triggerRef}
      backdropAriaLabel={cancelLabel}
      backdropDisabled={loading}
      layout="center"
      role="alertdialog"
      ariaModal
      ariaLabelledBy="delete-confirm-title"
      ariaDescribedBy="delete-confirm-description"
      panelClassName="max-w-sm overflow-hidden"
    >
      <DeleteConfirmContent
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={onConfirm}
        onCancel={onCancel}
        loading={loading}
        confirmVariant={confirmVariant}
      />
    </ModalShell>
  );
}

interface DeleteConfirmContentProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => boolean | void;
  onCancel: () => void;
  loading: boolean;
  confirmVariant: ButtonVariant;
}

function DeleteConfirmContent({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading,
  confirmVariant,
}: DeleteConfirmContentProps): ReactElement {
  const closeModal = useGenieModalClose(onCancel);

  const handleConfirm = (): void => {
    if (loading) return;
    const shouldClose = onConfirm();
    if (shouldClose === false) return;
    closeModal();
  };

  return (
    <>
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
        onCancel={closeModal}
        submitLabel={confirmLabel}
        submitType="button"
        onSubmit={handleConfirm}
        loading={loading}
        cancelDisabled={loading}
        submitVariant={confirmVariant}
      />
    </>
  );
}
