"use client";

import { useMemo, useState, useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Search, Trash2 } from "lucide-react";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { TablePagination } from "@/components/shared/TablePagination";
import {
  deleteEmployee,
  getEmployeesSnapshot,
  subscribeEmployees,
  updateEmployee,
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
import type { AdminEmployee } from "@/types/AdminApiTypes";
import { filterEmployeesByBranchAndDepartment } from "@/lib/admin/filterEmployees";
import { getDepartmentManagerName } from "@/lib/admin/departmentManagers";
import { searchEmployees } from "@/lib/admin/searchEmployees";
import { MainSelect } from "@/components/shared/MainSelect";

const PAGE_SIZE = 5;

export function AdminEmployeesPage(): ReactElement {
  const t = useTranslations("admin.employees");
  const tDept = useTranslations("admin.departments");
  const tBranch = useTranslations("auth.branchOptions");

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

  const [editing, setEditing] = useState<AdminEmployee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  });

  const openEdit = (employee: AdminEmployee): void => {
    setEditing(employee);
    setDraft({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
    });
  };

  const saveEdit = (): void => {
    if (!editing) return;
    updateEmployee(editing.id, draft);
    setEditing(null);
  };

  const confirmDelete = (): void => {
    if (!deleteId) return;
    deleteEmployee(deleteId);
    setDeleteId(null);
  };

  const columnCount = canManage ? 6 : 5;
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
                    onClick={clearFilters}
                  >
                    {t("filters.clear")}
                  </MainButton>
                ) : null}
              </div>
            ) : null}
            <div className="flex w-full items-center lg:w-auto lg:ms-auto">
              <p className="ms-auto shrink-0 text-sm font-semibold text-ink lg:ms-0">
                {t("resultsTitle", { count: filteredEmployees.length })}
              </p>
            </div>
          </div>
        </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
        <div className="admin-scroll-visible overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60">
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {t("columns.name")}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {t("columns.contact")}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {t("columns.position")}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {t("columns.department")}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {t("columns.departmentManager")}
                </th>
                {canManage ? (
                  <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                    {t("columns.actions")}
                  </th>
                ) : null}
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
                  <td className="px-4 py-3 text-start text-text-secondary">
                    {employee.position}
                  </td>
                  <td className="px-4 py-3 text-start text-text-secondary">
                    {tDept(employee.department)}
                  </td>
                  <td className="px-4 py-3 text-start text-text-secondary">
                    {getDepartmentManagerName(employee.department)}
                  </td>
                  {canManage ? (
                    <td className="px-4 py-3">
                      <div className="flex justify-start gap-2">
                        <MainButton
                          variant="edit-soft"
                          size="sm"
                          iconOnly
                          aria-label={t("edit")}
                          startIcon={<Pencil className="size-4" />}
                          onClick={() => openEdit(employee)}
                        />
                        <MainButton
                          variant="delete-soft"
                          size="sm"
                          iconOnly
                          aria-label={t("delete")}
                          startIcon={<Trash2 className="size-4" />}
                          onClick={() => setDeleteId(employee.id)}
                        />
                      </div>
                    </td>
                  ) : null}
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

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={t("cancel")}
            className="absolute inset-0 cursor-pointer bg-ink/50"
            onClick={() => setEditing(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-4 shadow-md">
            <h2 className="text-base font-semibold text-ink">{t("editTitle")}</h2>
            <div className="mt-4 flex flex-col gap-3">
              <MainInput
                label={t("fields.name")}
                value={draft.name}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <MainInput
                label={t("fields.email")}
                type="email"
                value={draft.email}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <MainInput
                label={t("fields.phone")}
                value={draft.phone}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              <MainInput
                label={t("fields.position")}
                value={draft.position}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, position: e.target.value }))
                }
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <MainButton variant="neutral" block onClick={() => setEditing(null)}>
                {t("cancel")}
              </MainButton>
              <MainButton variant="primary" block onClick={saveEdit}>
                {t("save")}
              </MainButton>
            </div>
          </div>
        </div>
      ) : null}

      <DeleteConfirmModal
        open={deleteId !== null}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={t("deleteConfirm")}
        cancelLabel={t("cancel")}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
