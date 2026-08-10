"use client";

import { useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MainButton } from "@/components/shared/MainButton";
import {
  getBranchDepartmentOverview,
  isBranchOption,
  isDepartmentOption,
} from "@/lib/admin/buildBranchOverviews";
import {
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";

export function AdminBranchDepartmentDetailPage(): ReactElement {
  const t = useTranslations("admin.branchesPage");
  const tBranch = useTranslations("auth.branchOptions");
  const tDept = useTranslations("admin.departments");
  const tEmployees = useTranslations("admin.employees");
  const params = useParams();

  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);

  const branchParam = params.branch;
  const departmentParam = params.department;
  const branchSlug = typeof branchParam === "string" ? branchParam : "";
  const departmentSlug =
    typeof departmentParam === "string" ? departmentParam : "";
  const branchDepartmentsHref = isBranchOption(branchSlug)
    ? `/admin-dashboard/branches/${branchSlug}`
    : "/admin-dashboard/branches";

  if (!isBranchOption(branchSlug) || !isDepartmentOption(departmentSlug)) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-xs">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("departmentNotFoundTitle")}
        </h1>
        <p className="text-sm text-text-secondary">
          {t("departmentNotFoundDescription")}
        </p>
        <MainButton variant="primary" size="sm" link={branchDepartmentsHref}>
          {t("backToBranch")}
        </MainButton>
      </div>
    );
  }

  const overview = getBranchDepartmentOverview(
    branchSlug,
    departmentSlug,
    getEmployeesSnapshot()
  );

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <MainButton
          variant="ghost-brand"
          size="sm"
          startIcon={<ArrowLeft className="size-4 rtl:rotate-180" />}
          link={branchDepartmentsHref}
        >
          {t("backToBranch")}
        </MainButton>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {tDept(overview.department)}
          </h1>
          <p className="text-sm text-text-secondary">
            {t("detailSubtitle", {
              branch: tBranch(overview.branch),
              manager: overview.manager.name,
              count: overview.members.length,
            })}
          </p>
        </div>
      </section>

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
        <div className="admin-scroll-visible overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60">
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {tEmployees("columns.name")}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {tEmployees("columns.contact")}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {tEmployees("columns.position")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-primary-200 bg-primary-50/50">
                <td className="px-4 py-3 text-start">
                  <p className="font-semibold text-ink">{overview.manager.name}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {overview.manager.position}
                  </p>
                </td>
                <td className="px-4 py-3 text-start">
                  <p className="text-ink">{overview.manager.email}</p>
                </td>
                <td className="px-4 py-3 text-start font-medium text-primary-700">
                  {overview.manager.position}
                </td>
              </tr>

              {overview.members.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-sm text-text-muted"
                  >
                    {t("emptyMembers")}
                  </td>
                </tr>
              ) : (
                overview.members.map((member) => (
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
    </div>
  );
}
