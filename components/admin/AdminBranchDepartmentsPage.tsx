"use client";

import { useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";
import {
  getBranchOverview,
  isBranchOption,
} from "@/lib/admin/buildBranchOverviews";
import {
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";

export function AdminBranchDepartmentsPage(): ReactElement {
  const t = useTranslations("admin.branchesPage");
  const tBranch = useTranslations("auth.branchOptions");
  const tDept = useTranslations("admin.departments");
  const router = useRouter();
  const params = useParams();

  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);

  const branchParam = params.branch;
  const branchSlug = typeof branchParam === "string" ? branchParam : "";

  if (!isBranchOption(branchSlug)) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-xs">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("branchNotFoundTitle")}
        </h1>
        <p className="text-sm text-text-secondary">{t("branchNotFoundDescription")}</p>
        <MainButton variant="primary" size="sm" link="/admin-dashboard/branches">
          {t("backToBranches")}
        </MainButton>
      </div>
    );
  }

  const overview = getBranchOverview(branchSlug, getEmployeesSnapshot());

  const openDepartment = (department: string): void => {
    router.push(`/admin-dashboard/branches/${branchSlug}/${department}`);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <MainButton
          variant="ghost-brand"
          size="sm"
          startIcon={<ArrowLeft className="size-4 rtl:rotate-180" />}
          link="/admin-dashboard/branches"
        >
          {t("backToBranches")}
        </MainButton>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {tBranch(overview.branch)}
          </h1>
          <p className="text-sm text-text-secondary">
            {t("branchSubtitle", {
              departments: overview.departments.length,
              employees: overview.employeeCount,
            })}
          </p>
        </div>
      </section>

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
        <div className="admin-scroll-visible overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60">
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {t("columns.department")}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {t("columns.manager")}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                  {t("columns.members")}
                </th>
                <th className="w-10 px-2 py-3" aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {overview.departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-text-muted"
                  >
                    {t("emptyDepartments")}
                  </td>
                </tr>
              ) : (
                overview.departments.map((department) => (
                  <tr
                    key={department.department}
                    className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-surface-muted/70"
                    onClick={() => openDepartment(department.department)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDepartment(department.department);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={t("openDepartment", {
                      department: tDept(department.department),
                    })}
                  >
                    <td className="px-4 py-3 text-start font-medium text-ink">
                      {tDept(department.department)}
                    </td>
                    <td className="px-4 py-3 text-start text-text-secondary">
                      {department.manager.name}
                    </td>
                    <td className="px-4 py-3 text-start text-text-secondary">
                      {t("memberCount", { count: department.memberCount })}
                    </td>
                    <td className="px-2 py-3 text-text-muted">
                      <ChevronRight className="size-4 rtl:rotate-180" />
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
