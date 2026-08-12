"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactElement,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Building2, MapPinned } from "lucide-react";
import { EmployeeManagerPicker } from "@/components/admin/EmployeeManagerPicker";
import { MainButton } from "@/components/shared/MainButton";
import { ModalShell } from "@/components/shared/ModalShell";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import {
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";
import {
  createBranchDepartment,
  getBranchesSnapshot,
  subscribeOrg,
} from "@/lib/admin/adminOrgStore";
import {
  createDepartmentSchema,
  type CreateDepartmentFormValues,
} from "@/schemas/admin/org.schema";

interface CreateDepartmentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateDepartmentModal({
  open,
  onClose,
}: CreateDepartmentModalProps): ReactElement | null {
  const t = useTranslations("admin.createDepartment");
  const [submitting, setSubmitting] = useState(false);

  useSyncExternalStore(subscribeOrg, getBranchesSnapshot, getBranchesSnapshot);
  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);

  const branches = getBranchesSnapshot();
  const employees = getEmployeesSnapshot();

  const schema = useMemo(
    () =>
      createDepartmentSchema({
        branchRequired: t("errors.branchRequired"),
        nameRequired: t("errors.nameRequired"),
        nameMin: t("errors.nameMin"),
        managerRequired: t("errors.managerRequired"),
      }),
    [t]
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
  } = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: emptyValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset(emptyValues());
  }, [open, reset]);

  const selectedBranchId = watch("branchId");
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId);

  const branchOptions = useMemo(
    () =>
      branches.map((branch) => ({
        value: branch.id,
        label: `${branch.name} · ${branch.city}`,
      })),
    [branches]
  );

  const handleBranchChange = (value: string): void => {
    setValue("managerEmployeeId", "", { shouldValidate: false });
    clearErrors("managerEmployeeId");
    if (isSubmitted) {
      setValue("branchId", value, { shouldValidate: true });
    }
  };

  const onSubmit = (values: CreateDepartmentFormValues): void => {
    setSubmitting(true);
    const created = createBranchDepartment({
      branchId: values.branchId,
      name: values.name,
      managerEmployeeId: values.managerEmployeeId,
    });
    setSubmitting(false);

    if (!created) {
      setError("name", { message: t("errors.duplicate") });
      return;
    }

    onClose();
  };

  const noBranches = branches.length === 0;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      backdropAriaLabel={t("cancel")}
    >
      <h2 className="text-base font-semibold text-ink">{t("title")}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>

          {noBranches ? (
            <div className="mt-4 rounded-xl border border-dashed border-border bg-surface-muted/30 p-4 text-center text-sm text-text-muted">
              {t("noBranches")}
            </div>
          ) : (
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
                    error={
                      isSubmitted ? errors.branchId?.message : undefined
                    }
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

              <div className="grid grid-cols-2 gap-2 pt-2">
                <MainButton variant="neutral" block type="button" onClick={onClose}>
                  {t("cancel")}
                </MainButton>
                <MainButton variant="primary" block type="submit" loading={submitting}>
                  {t("submit")}
                </MainButton>
              </div>
            </form>
          )}
    </ModalShell>
  );
}

function emptyValues(): CreateDepartmentFormValues {
  return {
    branchId: "",
    name: "",
    managerEmployeeId: "",
  };
}
