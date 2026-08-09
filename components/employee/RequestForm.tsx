"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import { MainDatePicker } from "@/components/shared/MainDatePicker";
import { MainInput } from "@/components/shared/MainInput";
import type { RequestType } from "@/lib/employee/demo-data";
import { leaveTypeSurface } from "@/lib/employee/demo-data";
import {
  createRequestSchema,
  type RequestFormValues,
} from "@/schemas/employee/request.schema";
import { cn } from "@/lib/utils";

export function RequestForm({ type }: { type: RequestType }) {
  const t = useTranslations("employee.requests");

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
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
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
          {t("new")}
        </h1>
        <p className="text-sm text-text-secondary">{t(`typeHints.${type}`)}</p>
      </section>

      <form
        onSubmit={handleSubmit(() => undefined)}
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
            <MainInput
              label={t("startTime")}
              type="time"
              required
              error={errors.startTime?.message}
              {...register("startTime")}
            />
            <MainInput
              label={t("endTime")}
              type="time"
              required
              error={errors.endTime?.message}
              {...register("endTime")}
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

        <MainButton type="submit" variant="primary" block className="mt-1">
          {t("submit")}
        </MainButton>
      </form>

      <Link
        href="/requests/new"
        className="inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        {t("back")}
      </Link>
    </div>
  );
}
