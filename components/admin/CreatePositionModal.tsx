"use client";

import { useEffect, useMemo, useState, type ReactElement, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Briefcase } from "lucide-react";
import { ModalFormActions } from "@/components/shared/ModalFormActions";
import { ModalShell } from "@/components/shared/ModalShell";
import { useGenieModalClose } from "@/components/shared/GenieModalShell";
import { MainInput } from "@/components/shared/MainInput";
import { createPosition } from "@/lib/admin/positionsStore";
import {
  createPositionSchema,
  type PositionFormValues,
} from "@/schemas/admin/position.schema";

interface CreatePositionModalProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
}

export function CreatePositionModal({
  open,
  onClose,
  triggerRef,
}: CreatePositionModalProps): ReactElement | null {
  const t = useTranslations("admin.createPosition");

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      triggerRef={triggerRef}
      backdropAriaLabel={t("cancel")}
    >
      <CreatePositionForm open={open} onClose={onClose} />
    </ModalShell>
  );
}

interface CreatePositionFormProps {
  open: boolean;
  onClose: () => void;
}

function CreatePositionForm({
  open,
  onClose,
}: CreatePositionFormProps): ReactElement {
  const t = useTranslations("admin.createPosition");
  const closeModal = useGenieModalClose(onClose);
  const [submitting, setSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      createPositionSchema({
        nameRequired: t("errors.nameRequired"),
        nameMin: t("errors.nameMin"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitted },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ name: "" });
  }, [open, reset]);

  const onSubmit = (values: PositionFormValues): void => {
    setSubmitting(true);
    const created = createPosition({ name: values.name });
    setSubmitting(false);

    if (!created) {
      setError("name", { message: t("errors.duplicate") });
      return;
    }

    closeModal();
  };

  return (
    <>
      <h2 className="text-base font-semibold text-ink">{t("title")}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-3"
        noValidate
      >
        <MainInput
          label={t("fields.name")}
          startIcon={<Briefcase />}
          error={isSubmitted ? errors.name?.message : undefined}
          {...register("name")}
          placeholder={t("placeholders.name")}
        />

        <ModalFormActions
          cancelLabel={t("cancel")}
          onCancel={closeModal}
          submitLabel={t("submit")}
          loading={submitting}
        />
      </form>
    </>
  );
}
