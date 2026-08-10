"use client";

import { useMemo, useState, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import type { AdminEmployee } from "@/types/AdminApiTypes";
import { searchEmployees } from "@/lib/admin/searchEmployees";
import { getDepartmentManagerName } from "@/lib/admin/departmentManagers";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { cn } from "@/lib/utils";

interface EmployeeManagerPickerProps {
  employees: AdminEmployee[];
  branchSlug?: string;
  selectedEmployeeId: string;
  onSelect: (employeeId: string) => void;
  error?: string;
}

export function EmployeeManagerPicker({
  employees,
  branchSlug,
  selectedEmployeeId,
  onSelect,
  error,
}: EmployeeManagerPickerProps): ReactElement {
  const t = useTranslations("admin.createDepartment");
  const tDept = useTranslations("admin.departments");
  const tEmployees = useTranslations("admin.employees");
  const [searchQuery, setSearchQuery] = useState("");

  const scopedEmployees = useMemo(() => {
    if (!branchSlug) return employees;
    return employees.filter((employee) => employee.branch === branchSlug);
  }, [branchSlug, employees]);

  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery.length > 0;

  const filteredEmployees = useMemo(
    () => {
      if (!isSearching) return [];
      return searchEmployees(scopedEmployees, trimmedQuery, {
        department: (value) => tDept(value),
        departmentManager: (value) => getDepartmentManagerName(value),
        status: (value) => tEmployees(`status.${value}`),
      });
    },
    [scopedEmployees, trimmedQuery, isSearching, tDept, tEmployees]
  );

  const selectedEmployee = scopedEmployees.find(
    (employee) => employee.id === selectedEmployeeId
  );
  const hasSelection = selectedEmployee !== undefined;

  const handleSelect = (employeeId: string): void => {
    onSelect(employeeId);
    setSearchQuery("");
  };

  const handleRemove = (): void => {
    onSelect("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-ink">{t("managerSection")}</p>
        <p className="mt-1 text-xs text-text-muted">{t("managerHint")}</p>
      </div>

      {selectedEmployee ? (
        <div className="flex items-start gap-2 rounded-xl border border-primary-200 bg-primary-50/50 px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">{selectedEmployee.name}</p>
            <p className="text-xs text-text-secondary">{selectedEmployee.email}</p>
            <p className="text-xs text-text-muted">{selectedEmployee.position}</p>
          </div>
          <MainButton
            type="button"
            variant="ghost-brand"
            size="sm"
            iconOnly
            aria-label={t("removeManager")}
            startIcon={<X className="size-4" />}
            onClick={handleRemove}
          />
        </div>
      ) : null}

      <MainInput
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder={t("placeholders.managerSearch")}
        startIcon={<Search />}
        aria-label={t("placeholders.managerSearch")}
        disabled={!branchSlug || hasSelection}
      />

      {!branchSlug ? (
        <p className="text-xs text-text-muted">{t("selectBranchFirst")}</p>
      ) : hasSelection ? null : !isSearching ? (
        <p className="text-xs text-text-muted">{t("typeToSearch")}</p>
      ) : (
        <ul className="max-h-52 space-y-2 overflow-y-auto rounded-xl border border-border bg-surface-muted/20 p-2">
          {filteredEmployees.length === 0 ? (
            <li className="px-2 py-6 text-center text-sm text-text-muted">
              {t("noEmployeesFound")}
            </li>
          ) : (
            filteredEmployees.map((employee) => (
              <li key={employee.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(employee.id)}
                  className={cn(
                    "w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2.5 text-start transition-colors hover:border-border-strong hover:bg-surface-muted/60"
                  )}
                >
                  <p className="text-sm font-medium text-ink">{employee.name}</p>
                  <p className="text-xs text-text-secondary">{employee.email}</p>
                  <p className="text-xs text-text-muted">{employee.position}</p>
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {error ? <p className="text-xs text-danger-600">{error}</p> : null}
    </div>
  );
}
