"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Mail, Phone, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "@/schemas/auth/register.schema";

export function RegisterForm() {
  const t = useTranslations("auth");

  const schema = useMemo(
    () =>
      createRegisterSchema({
        nameRequired: t("errors.nameRequired"),
        nameMin: t("errors.nameMin"),
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        phoneRequired: t("errors.phoneRequired"),
        phoneInvalid: t("errors.phoneInvalid"),
        passwordRequired: t("errors.passwordRequired"),
        passwordMin: t("errors.passwordMin"),
        confirmPasswordRequired: t("errors.confirmPasswordRequired"),
        passwordMismatch: t("errors.passwordMismatch"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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
        placeholder={t("register.namePlaceholder")}
        startIcon={<User />}
        error={errors.name?.message}
        {...register("name")}
      />

      <MainInput
        label={t("register.email")}
        type="email"
        autoComplete="email"
        placeholder={t("register.emailPlaceholder")}
        startIcon={<Mail />}
        error={errors.email?.message}
        {...register("email")}
      />

      <MainInput
        label={t("register.phone")}
        type="tel"
        autoComplete="tel"
        placeholder={t("register.phonePlaceholder")}
        startIcon={<Phone />}
        error={errors.phone?.message}
        {...register("phone")}
      />

      <MainInput
        label={t("register.password")}
        type="password"
        autoComplete="new-password"
        placeholder={t("register.passwordPlaceholder")}
        error={errors.password?.message}
        {...register("password")}
      />

      <MainInput
        label={t("register.confirmPassword")}
        type="password"
        autoComplete="new-password"
        placeholder={t("register.confirmPasswordPlaceholder")}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

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
