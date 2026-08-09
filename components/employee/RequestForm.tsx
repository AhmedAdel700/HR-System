"use client";

import { useMemo, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import { MainDatePicker } from "@/components/shared/MainDatePicker";
import { MainInput } from "@/components/shared/MainInput";
import { MainTimeInput } from "@/components/shared/MainTimeInput";
import type { RequestType } from "@/lib/employee/demo-data";
import { leaveTypeSurface } from "@/lib/employee/demo-data";
import { updateRequest } from "@/lib/employee/requestsStore";
import {
  createRequestSchema,
  type RequestFormValues,
} from "@/schemas/employee/request.schema";
import { cn } from "@/lib/utils";

export interface RequestFormProps {
  type: RequestType;
  mode?: "create" | "edit";
  requestId?: string;
  initialValues?: RequestFormValues;
}

export function RequestForm({
  type,
  mode = "create",
  requestId,
  initialValues,
}: RequestFormProps): ReactElement {
  const t = useTranslations("employee.requests");
  const router = useRouter();
  const isEdit = mode === "edit";

  const schema = useMemo(
    () =>
      createRequestSchema(type, {
        fromRequired: t("errors.fromRequired"),
        toRequired: t("errors.toRequired"),
        rangeInvalid: t("errors.rangeInvalid"),
        startTimeRequired: t("errors.startTimeRequired"),
        endTimeRequired: t("errors.endTimeRequired"),
        timeInvalid: t("errors.timeInvalid"),
        reasonRequired: t("errors.reasonRequired"),
        reasonMin: t("errors.reasonMin"),
      }),
    [t, type]
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues ?? {
      from: "",
      to: "",
      reason: "",
      note: "",
      startTime: "",
      endTime: "",
    },
  });

  const isPermission = type === "permission";
  const fromValue = watch("from");
  const fromDate = fromValue
    ? new Date(
        Number(fromValue.slice(0, 4)),
        Number(fromValue.slice(5, 7)) - 1,
        Number(fromValue.slice(8, 10))
      )
    : undefined;

  const onSubmit = (values: RequestFormValues): void => {
    if (isEdit && requestId) {
      const updated = updateRequest(requestId, values);
      if (updated) {
        router.push(`/requests/${requestId}`);
      }
      return;
    }
  };

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            leaveTypeSurface[type].soft
          )}
        >
          {t(`types.${type}`)}
        </span>
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          {isEdit ? t("editTitle") : t("new")}
        </h1>
        <p className="text-sm text-text-secondary">{t(`typeHints.${type}`)}</p>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <MainDatePicker
              label={t("from")}
              required
              placeholder={t("pickDate")}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.from?.message}
            />
          )}
        />

        <Controller
          name="to"
          control={control}
          render={({ field }) => (
            <MainDatePicker
              label={t("to")}
              required
              placeholder={t("pickDate")}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              minDate={fromDate}
              error={errors.to?.message}
            />
          )}
        />

        {isPermission ? (
          <>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <MainTimeInput
                  label={t("startTime")}
                  required
                  placeholder={t("pickTime")}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  error={errors.startTime?.message}
                />
              )}
            />
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <MainTimeInput
                  label={t("endTime")}
                  required
                  placeholder={t("pickTime")}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  error={errors.endTime?.message}
                />
              )}
            />
          </>
        ) : null}

        <MainInput
          as="textarea"
          label={t("reason")}
          required
          placeholder={t("placeholders.reason")}
          error={errors.reason?.message}
          {...register("reason")}
        />
        <MainInput
          as="textarea"
          label={t("note")}
          placeholder={t("placeholders.note")}
          error={errors.note?.message}
          {...register("note")}
        />

        <MainButton
          type="submit"
          variant="primary"
          block
          className="mt-1"
          loading={isSubmitting}
        >
          {isEdit ? t("save") : t("submit")}
        </MainButton>
      </form>

      <Link
        href={isEdit && requestId ? `/requests/${requestId}` : "/requests/new"}
        className="inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        {t("back")}
      </Link>
    </div>
  );
}
