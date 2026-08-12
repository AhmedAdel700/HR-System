"use client";

import { useMemo, useState, useSyncExternalStore, type MouseEvent, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Eye, Pencil, Search } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import { EditEmployeeAssignmentModal } from "@/components/admin/EditEmployeeAssignmentModal";
import { MainInput } from "@/components/shared/MainInput";
import { TablePagination } from "@/components/shared/TablePagination";
import {
  getEmployeeById,
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";
import {
  getAdminSessionSnapshot,
  subscribeAdminSession,
} from "@/lib/admin/adminSessionStore";
import {
  canManageEmployees,
  filterEmployeesForAdmin,
} from "@/lib/admin/permissions";
import {
  BRANCH_OPTIONS,
  DEPARTMENT_OPTIONS,
} from "@/lib/auth/register-options";
import { getDepartmentManagerName } from "@/lib/admin/departmentManagers";
import { filterEmployeesByBranchAndDepartment } from "@/lib/admin/filterEmployees";
import { searchEmployees } from "@/lib/admin/searchEmployees";
import { useModalTriggerRef } from "@/lib/useModalTriggerRef";
import { MainSelect } from "@/components/shared/MainSelect";

const PAGE_SIZE = 5;

export function AdminEmployeesPage(): ReactElement {
  const t = useTranslations("admin.employees");
  const tDept = useTranslations("admin.departments");
  const tBranch = useTranslations("auth.branchOptions");
  const router = useRouter();

  useSyncExternalStore(subscribeAdminSession, getAdminSessionSnapshot, getAdminSessionSnapshot);
  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);

  const admin = getAdminSessionSnapshot();
  const canManage = canManageEmployees(admin.role);
  const employees = filterEmployeesForAdmin(admin, getEmployeesSnapshot());

  const departmentOptions = useMemo(
    () => [
      { value: "all", label: t("filters.allDepartments") },
      ...DEPARTMENT_OPTIONS.map((value) => ({
        value,
        label: tDept(value),
      })),
    ],
    [t, tDept]
  );

  const branchOptions = useMemo(
    () => [
      { value: "all", label: t("filters.allBranches") },
      ...BRANCH_OPTIONS.map((value) => ({
        value,
        label: tBranch(value),
      })),
    ],
    [t, tBranch]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filteredEmployees = useMemo(() => {
    const byFilters = filterEmployeesByBranchAndDepartment(employees, {
      department:
        !canManage || departmentFilter === "all"
          ? "all"
          : (departmentFilter as (typeof DEPARTMENT_OPTIONS)[number]),
      branch:
        !canManage || branchFilter === "all"
          ? "all"
          : (branchFilter as (typeof BRANCH_OPTIONS)[number]),
    });

    return searchEmployees(byFilters, searchQuery, {
      department: (value) => tDept(value),
      departmentManager: (value) => getDepartmentManagerName(value),
      status: (value) => t(`status.${value}`),
    });
  }, [employees, departmentFilter, branchFilter, searchQuery, tDept, t, canManage]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedEmployees = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredEmployees.slice(start, start + PAGE_SIZE);
  }, [filteredEmployees, safePage]);

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDepartmentFilterChange = (value: string): void => {
    setDepartmentFilter(value);
    setPage(1);
  };

  const handleBranchFilterChange = (value: string): void => {
    setBranchFilter(value);
    setPage(1);
  };

  const hasActiveFilters =
    canManage && (departmentFilter !== "all" || branchFilter !== "all");

  const clearFilters = (): void => {
    setDepartmentFilter("all");
    setBranchFilter("all");
    setPage(1);
  };

  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const { triggerRef: editEmployeeTriggerRef, bindTrigger: bindEditEmployeeTrigger } =
    useModalTriggerRef();
  const editingEmployee = editingEmployeeId
    ? getEmployeeById(editingEmployeeId)
    : undefined;

  const columnCount = 7;
  const emptyMessage =
    employees.length === 0 ? t("emptyEmployees") : t("noResults");

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">
          {canManage ? t("subtitleSuperAdmin") : t("subtitleManager")}
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
          <div className="w-full lg:max-w-xs lg:shrink-0">
            <MainInput
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={t("searchPlaceholder")}
              startIcon={<Search />}
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <div className="flex flex-col gap-3 lg:min-w-0 lg:flex-1 lg:flex-row lg:items-center lg:gap-3">
            {canManage ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="min-w-0 flex-1 lg:w-40 lg:flex-none">
                    <MainSelect
                      value={departmentFilter}
                      onValueChange={handleDepartmentFilterChange}
                      options={departmentOptions}
                      placeholder={t("filters.department")}
                    />
                  </div>
                  <div className="min-w-0 flex-1 lg:w-40 lg:flex-none">
                    <MainSelect
                      value={branchFilter}
                      onValueChange={handleBranchFilterChange}
                      options={branchOptions}
                      placeholder={t("filters.branch")}
                    />
                  </div>
                </div>
                {hasActiveFilters ? (
                  <MainButton
                    variant="ghost-brand"
                    size="sm"
                    type="button"
                    className="hidden lg:inline-flex"
                    onClick={clearFilters}
                  >
                    {t("filters.clear")}
                  </MainButton>
                ) : null}
              </div>
            ) : null}
            <div className="flex w-full items-center gap-3 lg:w-auto lg:ms-auto">
              {hasActiveFilters ? (
                <MainButton
                  variant="ghost-brand"
                  size="sm"
                  type="button"
                  className="lg:hidden"
                  onClick={clearFilters}
                >
                  {t("filters.clear")}
                </MainButton>
              ) : null}
              <p className="ms-auto shrink-0 text-sm font-semibold text-ink lg:ms-0">
                {t("resultsTitle", { count: filteredEmployees.length })}
              </p>
            </div>
          </div>
        </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
        <div className="admin-scroll-visible overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60">
                <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                  {t("columns.name")}
                </th>
                <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                  {t("columns.contact")}
                </th>
                <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                  {t("columns.fingerprintNumber")}
                </th>
                <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                  {t("columns.position")}
                </th>
                <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                  {t("columns.department")}
                </th>
                <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                  {t("columns.departmentManager")}
                </th>
                <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                  {t("columns.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="px-4 py-10 text-center text-sm text-text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                pagedEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 text-start">
                    <p className="font-medium text-ink">{employee.name}</p>
                  </td>
                  <td className="px-4 py-3 text-start">
                    <p className="text-ink">{employee.email}</p>
                    <p className="text-xs text-text-muted">{employee.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-start font-mono text-sm tabular-nums text-text-secondary">
                    {employee.fingerprintNumber}
                  </td>
                  <td className="px-4 py-3 text-start text-text-secondary">
                    {employee.position}
                  </td>
                  <td className="px-4 py-3 text-start text-text-secondary">
                    {tDept(employee.department)}
                  </td>
                  <td className="px-4 py-3 text-start text-text-secondary">
                    {getDepartmentManagerName(employee.department)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-start gap-2">
                      <MainButton
                        variant="edit-soft"
                        size="sm"
                        iconOnly
                        aria-label={t("view")}
                        startIcon={<Eye className="size-4" />}
                        onClick={() =>
                          router.push(
                            `/admin-dashboard/employees/${employee.id}`
                          )
                        }
                      />
                      {canManage ? (
                        <MainButton
                          variant="edit-soft"
                          size="sm"
                          iconOnly
                          aria-label={t("edit")}
                          startIcon={<Pencil className="size-4" />}
                          onClick={(event) => {
                            bindEditEmployeeTrigger(event);
                            setEditingEmployeeId(employee.id);
                          }}
                        />
                      ) : null}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={safePage}
          pageSize={PAGE_SIZE}
          totalItems={filteredEmployees.length}
          onPageChange={setPage}
          previousLabel={t("pagination.previous")}
          nextLabel={t("pagination.next")}
          formatSummary={({ start, end, total }) =>
            t("pagination.summary", { start, end, total })
          }
        />
      </div>
      </section>

      {editingEmployee ? (
        <EditEmployeeAssignmentModal
          employee={editingEmployee}
          open={Boolean(editingEmployeeId)}
          onClose={() => setEditingEmployeeId(null)}
          triggerRef={editEmployeeTriggerRef}
        />
      ) : null}
    </div>
  );
}
