"use client";

import { useMemo, useState, useSyncExternalStore, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Briefcase,
  Fingerprint,
  Lock,
  Mail,
  MapPinned,
  Phone,
  User,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  RegisterWizardShell,
  type RegisterStepId,
} from "@/components/auth/RegisterWizardShell";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import {
  getPositionsSnapshot,
  subscribePositions,
} from "@/lib/admin/positionsStore";
import {
  BRANCH_OPTIONS,
  DEPARTMENT_OPTIONS,
} from "@/lib/auth/register-options";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "@/schemas/auth/register.schema";

const STEP_ORDER: RegisterStepId[] = ["profile", "work", "security"];

const STEP_FIELDS: Record<RegisterStepId, (keyof RegisterFormValues)[]> = {
  profile: ["name", "email", "phone", "avatar"],
  work: ["fingerprintNumber", "position", "branch", "department"],
  security: ["password", "confirmPassword"],
};

export function RegisterForm(): ReactElement {
  const t = useTranslations("auth");
  const tBranch = useTranslations("auth.branchOptions");
  const tDepartment = useTranslations("auth.departmentOptions");
  const [step, setStep] = useState<RegisterStepId>("profile");

  useSyncExternalStore(subscribePositions, getPositionsSnapshot, getPositionsSnapshot);
  const positions = getPositionsSnapshot();

  const schema = useMemo(
    () =>
      createRegisterSchema({
        nameRequired: t("errors.nameRequired"),
        nameMin: t("errors.nameMin"),
        emailRequired: t("errors.emailRequired"),
        emailInvalid: t("errors.emailInvalid"),
        phoneRequired: t("errors.phoneRequired"),
        phoneInvalid: t("errors.phoneInvalid"),
        fingerprintRequired: t("errors.fingerprintRequired"),
        fingerprintInvalid: t("errors.fingerprintInvalid"),
        branchRequired: t("errors.branchRequired"),
        departmentRequired: t("errors.departmentRequired"),
        positionRequired: t("errors.positionRequired"),
        positionMin: t("errors.positionMin"),
        passwordRequired: t("errors.passwordRequired"),
        passwordMin: t("errors.passwordMin"),
        confirmPasswordRequired: t("errors.confirmPasswordRequired"),
        passwordMismatch: t("errors.passwordMismatch"),
        avatarInvalidType: t("errors.avatarInvalidType"),
        avatarTooLarge: t("errors.avatarTooLarge"),
      }),
    [t],
  );

  const steps = useMemo(
    () =>
      STEP_ORDER.map((id) => ({
        id,
        label: t(`register.steps.${id}.title`),
        description: t(`register.steps.${id}.description`),
      })),
    [t],
  );

  const branchOptions = useMemo(
    () =>
      BRANCH_OPTIONS.map((value) => ({
        value,
        label: tBranch(value),
      })),
    [tBranch],
  );

  const departmentOptions = useMemo(
    () =>
      DEPARTMENT_OPTIONS.map((value) => ({
        value,
        label: tDepartment(value),
      })),
    [tDepartment],
  );

  const positionOptions = useMemo(
    () =>
      positions.map((position) => ({
        value: position.name,
        label: position.name,
      })),
    [positions],
  );

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      fingerprintNumber: "",
      branch: "",
      department: "",
      position: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });

  const stepIndex = STEP_ORDER.indexOf(step);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEP_ORDER.length - 1;

  const goBack = (): void => {
    if (isFirst) return;
    setStep(STEP_ORDER[stepIndex - 1] ?? "profile");
  };

  const goNext = async (): Promise<void> => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;

    if (isLast) return;
    setStep(STEP_ORDER[stepIndex + 1] ?? "security");
  };

  const onSubmit = handleSubmit(() => undefined);

  return (
    <RegisterWizardShell
      title={t("register.title")}
      subtitle={t("register.subtitle")}
      steps={steps}
      currentStep={step}
      footer={
        <>
          <div className="grid grid-cols-2 gap-2">
            <MainButton
              type="button"
              variant="neutral"
              block
              disabled={isFirst}
              startIcon={<ArrowLeft className="size-4 rtl:rotate-180" />}
              onClick={goBack}
            >
              {t("register.back")}
            </MainButton>

            {isLast ? (
              <MainButton type="submit" form="register-form" variant="primary" block>
                {t("register.submit")}
              </MainButton>
            ) : (
              <MainButton
                type="button"
                variant="primary"
                block
                endIcon={<ArrowRight className="size-4 rtl:rotate-180" />}
                onClick={() => {
                  void goNext();
                }}
              >
                {t("register.next")}
              </MainButton>
            )}
          </div>

          <p className="text-center text-sm text-text-secondary">
            {t("register.hasAccount")}{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              {t("register.loginLink")}
            </Link>
          </p>
        </>
      }
    >
      <form
        id="register-form"
        onSubmit={onSubmit}
        className="space-y-3"
        noValidate
      >
        {step === "profile" ? (
          <>
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <AvatarUpload
                  hint={t("register.avatarHint")}
                  optionalLabel={t("register.avatarOptional")}
                  uploadLabel={t("register.avatarUpload")}
                  changeLabel={t("register.avatarChange")}
                  removeLabel={t("register.avatarRemove")}
                  optional
                  value={field.value}
                  error={errors.avatar?.message}
                  onChange={field.onChange}
                />
              )}
            />
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
          </>
        ) : null}

        {step === "work" ? (
          <>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <MainSelect
                  label={t("register.position")}
                  startIcon={<Briefcase />}
                  error={errors.position?.message}
                  options={positionOptions}
                  placeholder={t("register.positionPlaceholder")}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <MainInput
              label={t("register.fingerprintNumber")}
              type="tel"
              autoComplete="off"
              startIcon={<Fingerprint />}
              error={errors.fingerprintNumber?.message}
              maxLength={20}
              {...register("fingerprintNumber")}
              placeholder={t("register.fingerprintPlaceholder")}
            />
            <Controller
              name="branch"
              control={control}
              render={({ field }) => (
                <MainSelect
                  label={t("register.branchLabel")}
                  startIcon={<MapPinned />}
                  error={errors.branch?.message}
                  options={branchOptions}
                  placeholder={t("register.branchPlaceholder")}
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
                  placeholder={t("register.departmentPlaceholder")}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </>
        ) : null}

        {step === "security" ? (
          <>
            <MainInput
              label={t("register.password")}
              type="password"
              autoComplete="new-password"
              startIcon={<Lock />}
              error={errors.password?.message}
              {...register("password")}
              placeholder={t("register.passwordPlaceholder")}
            />
            <MainInput
              label={t("register.confirmPassword")}
              type="password"
              autoComplete="new-password"
              startIcon={<Lock />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              placeholder={t("register.confirmPasswordPlaceholder")}
            />
          </>
        ) : null}
      </form>
    </RegisterWizardShell>
  );
}
