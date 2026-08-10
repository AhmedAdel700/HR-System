"use client";

import { useMemo, useState, useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { CreateDepartmentModal } from "@/components/admin/CreateDepartmentModal";
import { EditDepartmentModal } from "@/components/admin/EditDepartmentModal";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import {
  countDepartmentMembers,
  getEmployeeManagerProfile,
} from "@/lib/admin/departmentUtils";
import {
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";
import {
  getBranchDepartmentsSnapshot,
  getBranchesSnapshot,
  subscribeOrg,
  deleteBranchDepartment,
  getBranchDepartmentById,
} from "@/lib/admin/adminOrgStore";
import { searchBranchDepartments } from "@/lib/admin/searchBranchDepartments";
import type { AdminBranchDepartmentRecord } from "@/types/AdminApiTypes";

export function AdminDepartmentsPage(): ReactElement {
  const t = useTranslations("admin.departmentsPage");
  const router = useRouter();

  useSyncExternalStore(subscribeOrg, getBranchesSnapshot, getBranchesSnapshot);
  useSyncExternalStore(subscribeOrg, getBranchDepartmentsSnapshot, getBranchDepartmentsSnapshot);
  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);

  const branches = getBranchesSnapshot();
  const departments = getBranchDepartmentsSnapshot();
  const employees = getEmployeesSnapshot();

  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminBranchDepartmentRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const branchFilterOptions = useMemo(
    () => [
      { value: "all", label: t("filters.allBranches") },
      ...branches.map((branch) => ({
        value: branch.id,
        label: `${branch.name} · ${branch.city}`,
      })),
    ],
    [branches, t]
  );

  const departmentsByBranch = useMemo(() => {
    if (branchFilter === "all") return departments;
    return departments.filter(
      (department) => department.branchId === branchFilter
    );
  }, [departments, branchFilter]);

  const filteredDepartments = useMemo(
    () =>
      searchBranchDepartments(departmentsByBranch, searchQuery, {
        branchName: (branchId) =>
          branches.find((branch) => branch.id === branchId)?.name ?? "—",
        managerName: (managerEmployeeId) =>
          getEmployeeManagerProfile(managerEmployeeId, employees)?.name ?? "—",
      }),
    [departmentsByBranch, searchQuery, branches, employees]
  );

  const deleteTarget = deleteId ? getBranchDepartmentById(deleteId) ?? null : null;

  const openEdit = (department: AdminBranchDepartmentRecord): void => {
    setEditing(department);
  };

  const confirmDelete = (): void => {
    if (!deleteId) return;
    const result = deleteBranchDepartment(deleteId);
    if (!result.success) {
      setDeleteError(
        result.reason === "has_members"
          ? t("deleteBlockedMembers")
          : t("departmentNotFoundDescription")
      );
      return;
    }
    setDeleteId(null);
    setDeleteError(null);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
          <div className="w-full lg:max-w-xs lg:shrink-0">
            <MainInput
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              startIcon={<Search />}
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <div className="flex flex-col gap-3 lg:min-w-0 lg:flex-1 lg:flex-row lg:items-center lg:gap-3">
            <div className="min-w-0 flex-1 lg:w-40 lg:flex-none">
              <MainSelect
                value={branchFilter}
                onValueChange={setBranchFilter}
                options={branchFilterOptions}
                placeholder={t("filters.branch")}
              />
            </div>
            <div className="flex w-full items-center gap-3 lg:ms-auto lg:w-auto">
              <h2 className="ms-auto shrink-0 text-sm font-semibold text-ink lg:ms-0">
                {t("departmentsTitle", { count: filteredDepartments.length })}
              </h2>
              <MainButton
                variant="primary"
                size="sm"
                startIcon={<Plus className="size-4" />}
                onClick={() => setCreating(true)}
              >
                {t("createDepartment")}
              </MainButton>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
          <div className="admin-scroll-visible overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.department")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.branch")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.manager")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.members")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-text-muted"
                    >
                      {departments.length === 0
                        ? t("emptyDepartments")
                        : t("emptySearch")}
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((department) => {
                    const branch = branches.find(
                      (item) => item.id === department.branchId
                    );
                    const manager = getEmployeeManagerProfile(
                      department.managerEmployeeId,
                      employees
                    );
                    const memberCount = branch
                      ? countDepartmentMembers(
                          branch.slug,
                          department.slug,
                          employees
                        )
                      : 0;

                    return (
                      <tr
                        key={department.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-4 py-3 text-start font-medium text-ink">
                          {department.name}
                        </td>
                        <td className="px-4 py-3 text-start text-text-secondary">
                          {branch?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-start">
                          <p className="text-ink">{manager?.name ?? "—"}</p>
                          <p className="text-xs text-text-muted">
                            {manager?.email ?? "—"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-start text-text-secondary">
                          {memberCount}
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
                                  `/admin-dashboard/departments/${department.id}`
                                )
                              }
                            />
                            <MainButton
                              variant="edit-soft"
                              size="sm"
                              iconOnly
                              aria-label={t("edit")}
                              startIcon={<Pencil className="size-4" />}
                              onClick={() => openEdit(department)}
                            />
                            <MainButton
                              variant="delete-soft"
                              size="sm"
                              iconOnly
                              aria-label={t("delete")}
                              startIcon={<Trash2 className="size-4" />}
                              onClick={() => {
                                setDeleteError(null);
                                setDeleteId(department.id);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {editing ? (
        <EditDepartmentModal
          department={editing}
          open={editing !== null}
          onClose={() => setEditing(null)}
        />
      ) : null}

      <CreateDepartmentModal open={creating} onClose={() => setCreating(false)} />

      <DeleteConfirmModal
        open={deleteTarget !== null}
        title={t("deleteTitle")}
        description={
          deleteError ??
          (deleteTarget
            ? t("deleteDescription", { name: deleteTarget.name })
            : "")
        }
        confirmLabel={t("deleteConfirm")}
        cancelLabel={t("cancel")}
        onCancel={() => {
          setDeleteId(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
