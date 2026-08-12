"use client";

import { useEffect, useMemo, useState, type ReactElement, type RefObject } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Building2, MapPinned } from "lucide-react";
import { ModalFormActions } from "@/components/shared/ModalFormActions";
import { ModalShell } from "@/components/shared/ModalShell";
import { useGenieModalClose } from "@/components/shared/GenieModalShell";
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
  triggerRef?: RefObject<HTMLElement | null>;
}

export function EditEmployeeAssignmentModal({
  employee,
  open,
  onClose,
  triggerRef,
}: EditEmployeeAssignmentModalProps): ReactElement | null {
  const t = useTranslations("admin.employees");

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      triggerRef={triggerRef}
      backdropAriaLabel={t("cancel")}
    >
      <EditEmployeeAssignmentForm
        employee={employee}
        open={open}
        onClose={onClose}
      />
    </ModalShell>
  );
}

interface EditEmployeeAssignmentFormProps {
  employee: AdminEmployee;
  open: boolean;
  onClose: () => void;
}

function EditEmployeeAssignmentForm({
  employee,
  open,
  onClose,
}: EditEmployeeAssignmentFormProps): ReactElement {
  const t = useTranslations("admin.employees");
  const closeModal = useGenieModalClose(onClose);
  const [submitting, setSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      updateEmployeeAssignmentSchema({
        branchRequired: t("errors.branchRequired"),
        departmentRequired: t("errors.departmentRequired"),
        positionRequired: t("errors.positionRequired"),
        positionMin: t("errors.positionMin"),
      }),
    [t],
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
    [branches],
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
    closeModal();
  };

  return (
    <>
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

        <ModalFormActions
          cancelLabel={t("cancel")}
          onCancel={closeModal}
          submitLabel={t("save")}
          loading={submitting}
        />
      </form>
    </>
  );
}

function toFormValues(
  employee: AdminEmployee,
): UpdateEmployeeAssignmentFormValues {
  return {
    branch: employee.branch,
    department: employee.department,
    position: employee.position,
  };
}
