"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CalendarDays, Layers } from "lucide-react";
import { MainButton } from "@/components/shared/MainButton";
import { ModalShell } from "@/components/shared/ModalShell";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import { createLeaveType } from "@/lib/admin/leaveTypesStore";
import {
  createLeaveTypeSchema,
  type CreateLeaveTypeFormValues,
} from "@/schemas/admin/leave-type.schema";

interface CreateLeaveTypeModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateLeaveTypeModal({
  open,
  onClose,
}: CreateLeaveTypeModalProps): ReactElement | null {
  const t = useTranslations("admin.createLeaveType");
  const tLeave = useTranslations("employee.leave");
  const [submitting, setSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      createLeaveTypeSchema({
        nameRequired: t("errors.nameRequired"),
        nameMin: t("errors.nameMin"),
        unitRequired: t("errors.unitRequired"),
        categoryRequired: t("errors.categoryRequired"),
        categoryMin: t("errors.categoryMin"),
        entitlementRequired: t("errors.entitlementRequired"),
        entitlementMin: t("errors.entitlementMin"),
      }),
    [t]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<CreateLeaveTypeFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset(emptyValues());
  }, [open, reset]);

  const unitOptions = useMemo(
    () => [
      { value: "days", label: tLeave("units.days") },
      { value: "hours", label: tLeave("units.hours") },
    ],
    [tLeave]
  );

  const onSubmit = (values: CreateLeaveTypeFormValues): void => {
    setSubmitting(true);
    createLeaveType({
      ...values,
      category: values.category.trim(),
      defaultEntitlement: Number(values.defaultEntitlement),
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      backdropAriaLabel={t("cancel")}
    >
      <h2 className="text-base font-semibold text-ink">{t("title")}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 space-y-3"
            noValidate
          >
            <MainInput
              label={t("fields.name")}
              error={isSubmitted ? errors.name?.message : undefined}
              {...register("name")}
              placeholder={t("placeholders.name")}
            />

            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <MainSelect
                  label={t("fields.unit")}
                  startIcon={<CalendarDays />}
                  placeholder={t("placeholders.unit")}
                  options={unitOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  error={isSubmitted ? errors.unit?.message : undefined}
                />
              )}
            />

            <MainInput
              label={t("fields.category")}
              startIcon={<Layers />}
              error={isSubmitted ? errors.category?.message : undefined}
              {...register("category")}
              placeholder={t("placeholders.category")}
            />

            <MainInput
              label={t("fields.defaultEntitlement")}
              type="number"
              min={1}
              inputMode="numeric"
              error={isSubmitted ? errors.defaultEntitlement?.message : undefined}
              {...register("defaultEntitlement")}
              placeholder={t("placeholders.defaultEntitlement")}
            />

            <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
              <MainButton variant="neutral" block type="button" onClick={onClose}>
                {t("cancel")}
              </MainButton>
              <MainButton variant="primary" block type="submit" loading={submitting}>
                {t("submit")}
              </MainButton>
            </div>
          </form>
    </ModalShell>
  );
}

function emptyValues(): CreateLeaveTypeFormValues {
  return {
    name: "",
    unit: "days",
    category: "",
    defaultEntitlement: "1",
  };
}
