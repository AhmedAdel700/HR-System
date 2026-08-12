"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Building2, Mail, MapPinned, Phone } from "lucide-react";
import { MainButton } from "@/components/shared/MainButton";
import { ModalShell } from "@/components/shared/ModalShell";
import { MainInput } from "@/components/shared/MainInput";
import { createBranch } from "@/lib/admin/adminOrgStore";
import {
  createBranchSchema,
  type CreateBranchFormValues,
} from "@/schemas/admin/org.schema";

interface CreateBranchModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateBranchModal({
  open,
  onClose,
}: CreateBranchModalProps): ReactElement | null {
  const t = useTranslations("admin.createBranch");
  const [submitting, setSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      createBranchSchema({
        nameRequired: t("errors.nameRequired"),
        nameMin: t("errors.nameMin"),
        cityRequired: t("errors.cityRequired"),
        addressRequired: t("errors.addressRequired"),
        phoneRequired: t("errors.phoneRequired"),
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<CreateBranchFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset(emptyValues());
  }, [open, reset]);

  const onSubmit = (values: CreateBranchFormValues): void => {
    setSubmitting(true);
    createBranch(values);
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
              startIcon={<Building2 />}
              error={isSubmitted ? errors.name?.message : undefined}
              {...register("name")}
              placeholder={t("placeholders.name")}
            />
            <MainInput
              label={t("fields.city")}
              startIcon={<MapPinned />}
              error={isSubmitted ? errors.city?.message : undefined}
              {...register("city")}
              placeholder={t("placeholders.city")}
            />
            <MainInput
              as="textarea"
              label={t("fields.address")}
              error={isSubmitted ? errors.address?.message : undefined}
              {...register("address")}
              placeholder={t("placeholders.address")}
            />
            <MainInput
              label={t("fields.phone")}
              type="tel"
              startIcon={<Phone />}
              error={isSubmitted ? errors.phone?.message : undefined}
              {...register("phone")}
              placeholder={t("placeholders.phone")}
            />
            <MainInput
              label={t("fields.email")}
              type="email"
              startIcon={<Mail />}
              error={isSubmitted ? errors.email?.message : undefined}
              {...register("email")}
              placeholder={t("placeholders.email")}
            />

            <div className="grid grid-cols-2 gap-2 pt-2">
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

function emptyValues(): CreateBranchFormValues {
  return {
    name: "",
    city: "",
    address: "",
    phone: "",
    email: "",
  };
}
