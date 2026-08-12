"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactElement,
  type RefObject,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Building2, MapPinned } from "lucide-react";
import { EmployeeManagerPicker } from "@/components/admin/EmployeeManagerPicker";
import { ModalFormActions } from "@/components/shared/ModalFormActions";
import { ModalShell } from "@/components/shared/ModalShell";
import { useGenieModalClose } from "@/components/shared/GenieModalShell";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import {
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";
import {
  getBranchesSnapshot,
  subscribeOrg,
  updateBranchDepartment,
} from "@/lib/admin/adminOrgStore";
import {
  updateDepartmentSchema,
  type UpdateDepartmentFormValues,
} from "@/schemas/admin/org.schema";
import type { AdminBranchDepartmentRecord } from "@/types/AdminApiTypes";

interface EditDepartmentModalProps {
  department: AdminBranchDepartmentRecord;
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
}

export function EditDepartmentModal({
  department,
  open,
  onClose,
  triggerRef,
}: EditDepartmentModalProps): ReactElement | null {
  const tPage = useTranslations("admin.departmentsPage");

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      triggerRef={triggerRef}
      backdropAriaLabel={tPage("cancel")}
    >
      <EditDepartmentForm department={department} open={open} onClose={onClose} />
    </ModalShell>
  );
}

interface EditDepartmentFormProps {
  department: AdminBranchDepartmentRecord;
  open: boolean;
  onClose: () => void;
}

function EditDepartmentForm({
  department,
  open,
  onClose,
}: EditDepartmentFormProps): ReactElement {
  const t = useTranslations("admin.createDepartment");
  const tPage = useTranslations("admin.departmentsPage");
  const closeModal = useGenieModalClose(onClose);
  const [submitting, setSubmitting] = useState(false);

  useSyncExternalStore(subscribeOrg, getBranchesSnapshot, getBranchesSnapshot);
  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);

  const branches = getBranchesSnapshot();
  const employees = getEmployeesSnapshot();

  const schema = useMemo(
    () =>
      updateDepartmentSchema({
        branchRequired: t("errors.branchRequired"),
        nameRequired: t("errors.nameRequired"),
        nameMin: t("errors.nameMin"),
        managerRequired: t("errors.managerRequired"),
      }),
    [t],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<UpdateDepartmentFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: toFormValues(department),
  });

  useEffect(() => {
    if (!open) return;
    reset(toFormValues(department));
  }, [open, department, reset]);

  const selectedBranchId = watch("branchId");
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId);

  const branchOptions = useMemo(
    () =>
      branches.map((branch) => ({
        value: branch.id,
        label: `${branch.name} · ${branch.city}`,
      })),
    [branches],
  );

  const handleBranchChange = (value: string): void => {
    setValue("managerEmployeeId", "", { shouldValidate: false });
    clearErrors("managerEmployeeId");
    if (isSubmitted) {
      setValue("branchId", value, { shouldValidate: true });
    }
  };

  const onSubmit = (values: UpdateDepartmentFormValues): void => {
    setSubmitting(true);
    const updated = updateBranchDepartment(department.id, values);
    setSubmitting(false);

    if (!updated) {
      setError("name", { message: t("errors.duplicate") });
      return;
    }

    closeModal();
  };

  return (
    <>
      <h2 className="text-base font-semibold text-ink">{tPage("editTitle")}</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-3"
        noValidate
      >
        <Controller
          control={control}
          name="branchId"
          render={({ field }) => (
            <MainSelect
              label={t("fields.branch")}
              startIcon={<MapPinned />}
              placeholder={t("placeholders.branch")}
              options={branchOptions}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                handleBranchChange(value);
              }}
              onBlur={field.onBlur}
              error={isSubmitted ? errors.branchId?.message : undefined}
            />
          )}
        />

        <MainInput
          label={t("fields.name")}
          startIcon={<Building2 />}
          error={isSubmitted ? errors.name?.message : undefined}
          {...register("name")}
          placeholder={t("placeholders.name")}
        />

        <Controller
          control={control}
          name="managerEmployeeId"
          render={({ field }) => (
            <EmployeeManagerPicker
              employees={employees}
              branchSlug={selectedBranch?.slug}
              selectedEmployeeId={field.value}
              onSelect={(employeeId) => {
                field.onChange(employeeId);
                if (employeeId) {
                  clearErrors("managerEmployeeId");
                }
              }}
              error={
                isSubmitted ? errors.managerEmployeeId?.message : undefined
              }
            />
          )}
        />

        <ModalFormActions
          cancelLabel={tPage("cancel")}
          onCancel={closeModal}
          submitLabel={tPage("save")}
          loading={submitting}
        />
      </form>
    </>
  );
}

function toFormValues(
  department: AdminBranchDepartmentRecord,
): UpdateDepartmentFormValues {
  return {
    branchId: department.branchId,
    name: department.name,
    managerEmployeeId: department.managerEmployeeId,
  };
}
