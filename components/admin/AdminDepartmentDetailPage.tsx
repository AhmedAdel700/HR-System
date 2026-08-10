"use client";

import { useMemo, useState, useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import {
  getBranchDepartmentOverview,
  getBranchDisplayName,
} from "@/lib/admin/buildBranchOverviews";
import { getDepartmentManagerName } from "@/lib/admin/departmentManagers";
import {
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";
import {
  getBranchDepartmentById,
  getBranchById,
  getBranchDepartmentsSnapshot,
  getBranchesSnapshot,
  subscribeOrg,
} from "@/lib/admin/adminOrgStore";
import { searchEmployees } from "@/lib/admin/searchEmployees";

export function AdminDepartmentDetailPage(): ReactElement {
  const t = useTranslations("admin.departmentDetailPage");
  const tDept = useTranslations("admin.departments");
  const tEmployees = useTranslations("admin.employees");
  const tBranch = useTranslations("auth.branchOptions");
  const params = useParams();

  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);
  useSyncExternalStore(subscribeOrg, getBranchesSnapshot, getBranchesSnapshot);
  useSyncExternalStore(subscribeOrg, getBranchDepartmentsSnapshot, getBranchDepartmentsSnapshot);

  const departmentParam = params.departmentId;
  const departmentId =
    typeof departmentParam === "string" ? departmentParam : "";

  const [searchQuery, setSearchQuery] = useState("");

  const employees = getEmployeesSnapshot();
  const branches = getBranchesSnapshot();
  const department = departmentId
    ? getBranchDepartmentById(departmentId)
    : undefined;
  const branch = department ? getBranchById(department.branchId) : undefined;

  const overview =
    department && branch
      ? getBranchDepartmentOverview(branch.slug, department.slug, employees)
      : undefined;

  const memberRows = useMemo(() => {
    if (!overview || !department) return [];
    return overview.members.filter(
      (member) => member.id !== department.managerEmployeeId
    );
  }, [overview, department]);

  const filteredMembers = useMemo(
    () =>
      searchEmployees(memberRows, searchQuery, {
        department: (value) => tDept(value),
        departmentManager: (value) => getDepartmentManagerName(value),
        status: (value) => tEmployees(`status.${value}`),
      }),
    [memberRows, searchQuery, tDept, tEmployees]
  );

  if (!department || !branch || !overview) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-xs">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("notFoundTitle")}
        </h1>
        <p className="text-sm text-text-secondary">{t("notFoundDescription")}</p>
        <MainButton variant="primary" size="sm" link="/admin-dashboard/departments">
          {t("backToDepartments")}
        </MainButton>
      </div>
    );
  }

  const branchName = getBranchDisplayName(
    branch.slug,
    branches,
    (value) => tBranch(value)
  );

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <MainButton
          variant="ghost-brand"
          size="sm"
          startIcon={<ArrowLeft className="size-4 rtl:rotate-180" />}
          link="/admin-dashboard/departments"
        >
          {t("backToDepartments")}
        </MainButton>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {overview.name}
          </h1>
          <p className="text-sm text-text-secondary">
            {t("subtitle", {
              branch: branchName,
              manager: overview.manager.name,
              count: memberRows.length,
            })}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="w-full max-w-xs">
          <MainInput
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            startIcon={<Search />}
            aria-label={t("searchPlaceholder")}
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
          <div className="admin-scroll-visible overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {tEmployees("columns.name")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {tEmployees("columns.contact")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {tEmployees("columns.position")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-primary-200 bg-primary-50/50">
                  <td className="px-4 py-3 text-start">
                    <p className="font-semibold text-ink">{overview.manager.name}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {t("managerLabel")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-start">
                    <p className="text-ink">{overview.manager.email}</p>
                  </td>
                  <td className="px-4 py-3 text-start font-medium text-primary-700">
                    {overview.manager.position}
                  </td>
                </tr>

                {filteredMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-10 text-center text-sm text-text-muted"
                    >
                      {searchQuery.trim()
                        ? t("emptySearch")
                        : t("emptyMembers")}
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 text-start">
                        <p className="font-medium text-ink">{member.name}</p>
                      </td>
                      <td className="px-4 py-3 text-start">
                        <p className="text-ink">{member.email}</p>
                        <p className="text-xs text-text-muted">{member.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {member.position}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
