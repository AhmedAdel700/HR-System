"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/schemas/auth/login.schema";

export function LoginForm({
  showRegisterLink = true,
}: {
  showRegisterLink?: boolean;
}) {
  const t = useTranslations("auth");

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        passwordRequired: t("errors.passwordRequired"),
        passwordMin: t("errors.passwordMin"),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(() => undefined)}
      className="flex flex-col gap-4"
      noValidate
    >
      <MainInput
        label={t("login.email")}
        type="email"
        autoComplete="email"
        placeholder={t("login.emailPlaceholder")}
        startIcon={<Mail />}
        error={errors.email?.message}
        {...register("email")}
      />

      <MainInput
        label={t("login.password")}
        type="password"
        autoComplete="current-password"
        placeholder={t("login.passwordPlaceholder")}
        error={errors.password?.message}
        {...register("password")}
      />

      <MainButton type="submit" variant="primary" block className="mt-1">
        {t("login.submit")}
      </MainButton>

      {showRegisterLink ? (
        <p className="text-center text-sm text-text-secondary">
          {t("login.noAccount")}{" "}
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            {t("login.registerLink")}
          </Link>
        </p>
      ) : null}
    </form>
  );
}
