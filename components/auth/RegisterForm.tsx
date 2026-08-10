"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Building2, Briefcase, Mail, MapPinned, Phone, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import {
  BRANCH_OPTIONS,
  DEPARTMENT_OPTIONS,
} from "@/lib/auth/register-options";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "@/schemas/auth/register.schema";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tBranch = useTranslations("auth.branchOptions");
  const tDepartment = useTranslations("auth.departmentOptions");

  const schema = useMemo(
    () =>
      createRegisterSchema({
        nameRequired: t("errors.nameRequired"),
        nameMin: t("errors.nameMin"),
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        phoneRequired: t("errors.phoneRequired"),
        phoneInvalid: t("errors.phoneInvalid"),
        branchRequired: t("errors.branchRequired"),
        departmentRequired: t("errors.departmentRequired"),
        positionRequired: t("errors.positionRequired"),
        positionMin: t("errors.positionMin"),
        passwordRequired: t("errors.passwordRequired"),
        passwordMin: t("errors.passwordMin"),
        confirmPasswordRequired: t("errors.confirmPasswordRequired"),
        passwordMismatch: t("errors.passwordMismatch"),
      }),
    [t]
  );

  const branchOptions = useMemo(
    () =>
      BRANCH_OPTIONS.map((value) => ({
        value,
        label: tBranch(value),
      })),
    [tBranch]
  );

  const departmentOptions = useMemo(
    () =>
      DEPARTMENT_OPTIONS.map((value) => ({
        value,
        label: tDepartment(value),
      })),
    [tDepartment]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      branch: "",
      department: "",
      position: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(() => undefined)}
      className="flex flex-col gap-4"
      noValidate
    >
      <MainInput
        label={t("register.name")}
        autoComplete="name"
        startIcon={<User />}
        error={errors.name?.message}
        {...register("name")}
        placeholder={t("register.namePlaceholder")}
      />

      <MainInput
        label={t("register.email")}
        type="email"
        autoComplete="email"
        startIcon={<Mail />}
        error={errors.email?.message}
        {...register("email")}
        placeholder={t("register.emailPlaceholder")}
      />

      <MainInput
        label={t("register.phone")}
        type="tel"
        autoComplete="tel"
        startIcon={<Phone />}
        error={errors.phone?.message}
        {...register("phone")}
        placeholder={t("register.phonePlaceholder")}
      />

      <MainInput
        label={t("register.position")}
        autoComplete="organization-title"
        startIcon={<Briefcase />}
        error={errors.position?.message}
        {...register("position")}
        placeholder={t("register.positionPlaceholder")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="branch"
          control={control}
          render={({ field }) => (
            <MainSelect
              label={t("register.branchLabel")}
              startIcon={<MapPinned />}
              error={errors.branch?.message}
              options={branchOptions}
              placeholder={t("register.branchLabel")}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <MainSelect
              label={t("register.departmentLabel")}
              startIcon={<Building2 />}
              error={errors.department?.message}
              options={departmentOptions}
              placeholder={t("register.departmentLabel")}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MainInput
          label={t("register.password")}
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
          placeholder={t("register.passwordPlaceholder")}
        />
        <MainInput
          label={t("register.confirmPassword")}
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
          placeholder={t("register.confirmPasswordPlaceholder")}
        />
      </div>

      <MainButton type="submit" variant="primary" block className="mt-1">
        {t("register.submit")}
      </MainButton>

      <p className="text-center text-sm text-text-secondary">
        {t("register.hasAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          {t("register.loginLink")}
        </Link>
      </p>
    </form>
  );
}
