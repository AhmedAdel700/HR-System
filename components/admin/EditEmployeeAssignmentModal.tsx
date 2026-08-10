"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Building2, MapPinned } from "lucide-react";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import {
  getBranchDepartmentsSnapshot,
  getBranchesSnapshot,
} from "@/lib/admin/adminOrgStore";
import { updateEmployee } from "@/lib/admin/adminDataStore";
import {
  updateEmployeeAssignmentSchema,
  type UpdateEmployeeAssignmentFormValues,
} from "@/schemas/admin/employee.schema";
import type { AdminEmployee } from "@/types/AdminApiTypes";
import type { BranchOption, DepartmentOption } from "@/lib/auth/register-options";

interface EditEmployeeAssignmentModalProps {
  employee: AdminEmployee;
  open: boolean;
  onClose: () => void;
}

export function EditEmployeeAssignmentModal({
  employee,
  open,
  onClose,
}: EditEmployeeAssignmentModalProps): ReactElement | null {
  const t = useTranslations("admin.employees");
  const [submitting, setSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      updateEmployeeAssignmentSchema({
        branchRequired: t("errors.branchRequired"),
        departmentRequired: t("errors.departmentRequired"),
        positionRequired: t("errors.positionRequired"),
        positionMin: t("errors.positionMin"),
      }),
    [t]
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<UpdateEmployeeAssignmentFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: toFormValues(employee),
  });

  useEffect(() => {
    if (!open) return;
    reset(toFormValues(employee));
  }, [open, employee, reset]);

  const selectedBranchSlug = watch("branch");
  const branches = getBranchesSnapshot();
  const departments = getBranchDepartmentsSnapshot();
  const selectedBranch = branches.find((branch) => branch.slug === selectedBranchSlug);

  const branchOptions = useMemo(
    () =>
      branches.map((branch) => ({
        value: branch.slug,
        label: `${branch.name} · ${branch.city}`,
      })),
    [branches]
  );

  const departmentOptions = useMemo(() => {
    if (!selectedBranch) return [];
    return departments
      .filter((department) => department.branchId === selectedBranch.id)
      .map((department) => ({
        value: department.slug,
        label: department.name,
      }));
  }, [departments, selectedBranch]);

  const handleBranchChange = (): void => {
    setValue("department", "", { shouldValidate: isSubmitted });
  };

  const onSubmit = (values: UpdateEmployeeAssignmentFormValues): void => {
    setSubmitting(true);
    updateEmployee(employee.id, {
      branch: values.branch as BranchOption,
      department: values.department as DepartmentOption,
      position: values.position.trim(),
    });
    setSubmitting(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
      <button
        type="button"
        aria-label={t("cancel")}
        className="fixed inset-0 cursor-pointer bg-ink/50"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-4 shadow-md">
          <h2 className="text-base font-semibold text-ink">{t("editTitle")}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t("editSubtitle")}</p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 space-y-3"
            noValidate
          >
            <Controller
              control={control}
              name="branch"
              render={({ field }) => (
                <MainSelect
                  label={t("fields.branch")}
                  startIcon={<MapPinned />}
                  placeholder={t("placeholders.branch")}
                  options={branchOptions}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleBranchChange();
                  }}
                  onBlur={field.onBlur}
                  error={isSubmitted ? errors.branch?.message : undefined}
                />
              )}
            />

            <Controller
              control={control}
              name="department"
              render={({ field }) => (
                <MainSelect
                  label={t("fields.department")}
                  startIcon={<Building2 />}
                  placeholder={t("placeholders.department")}
                  options={departmentOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={!selectedBranch}
                  error={isSubmitted ? errors.department?.message : undefined}
                />
              )}
            />

            <MainInput
              label={t("fields.position")}
              error={isSubmitted ? errors.position?.message : undefined}
              {...register("position")}
              placeholder={t("placeholders.position")}
            />

            <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
              <MainButton variant="neutral" block type="button" onClick={onClose}>
                {t("cancel")}
              </MainButton>
              <MainButton variant="primary" block type="submit" loading={submitting}>
                {t("save")}
              </MainButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function toFormValues(
  employee: AdminEmployee
): UpdateEmployeeAssignmentFormValues {
  return {
    branch: employee.branch,
    department: employee.department,
    position: employee.position,
  };
}
