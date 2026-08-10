"use client";

import { useMemo, useState, useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Check, Eye, Search, X } from "lucide-react";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { LeaveRequestViewModal } from "@/components/admin/LeaveRequestViewModal";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { MainSelect } from "@/components/shared/MainSelect";
import { TablePagination } from "@/components/shared/TablePagination";
import { leaveTypeSurface, type DemoRequest } from "@/lib/employee/demo-data";
import {
  getRequestsSnapshot,
  setRequestStatus,
  subscribeRequests,
} from "@/lib/employee/requestsStore";
import {
  getAdminSessionSnapshot,
  subscribeAdminSession,
} from "@/lib/admin/adminSessionStore";
import { filterLeaveRequestsForAdmin, isSuperAdmin } from "@/lib/admin/permissions";
import { filterLeaveRequestsByBranchAndDepartment } from "@/lib/admin/filterLeaveRequests";
import { searchLeaveRequests } from "@/lib/admin/searchLeaveRequests";
import {
  BRANCH_OPTIONS,
  DEPARTMENT_OPTIONS,
} from "@/lib/auth/register-options";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

function formatRequestDates(from: string, to: string): string {
  return from === to ? from : `${from} → ${to}`;
}

export function AdminLeaveRequestsPage(): ReactElement {
  const t = useTranslations("admin.leaveRequests");
  const tFilters = useTranslations("admin.employees.filters");
  const tDept = useTranslations("admin.departments");
  const tBranch = useTranslations("auth.branchOptions");
  const tType = useTranslations("employee.requests.types");

  useSyncExternalStore(subscribeAdminSession, getAdminSessionSnapshot, getAdminSessionSnapshot);
  useSyncExternalStore(subscribeRequests, getRequestsSnapshot, getRequestsSnapshot);

  const admin = getAdminSessionSnapshot();
  const superAdmin = isSuperAdmin(admin.role);
  const allRequests = getRequestsSnapshot();
  const requests = filterLeaveRequestsForAdmin(admin, allRequests);
  const pending = requests.filter((item) => item.status === "pending");

  const departmentOptions = useMemo(
    () => [
      { value: "all", label: tFilters("allDepartments") },
      ...DEPARTMENT_OPTIONS.map((value) => ({
        value,
        label: tDept(value),
      })),
    ],
    [tFilters, tDept]
  );

  const branchOptions = useMemo(
    () => [
      { value: "all", label: tFilters("allBranches") },
      ...BRANCH_OPTIONS.map((value) => ({
        value,
        label: tBranch(value),
      })),
    ],
    [tFilters, tBranch]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const filteredPending = useMemo(() => {
    const byFilters = filterLeaveRequestsByBranchAndDepartment(pending, {
      department:
        !superAdmin || departmentFilter === "all"
          ? "all"
          : (departmentFilter as (typeof DEPARTMENT_OPTIONS)[number]),
      branch:
        !superAdmin || branchFilter === "all"
          ? "all"
          : (branchFilter as (typeof BRANCH_OPTIONS)[number]),
    });

    return searchLeaveRequests(byFilters, searchQuery, {
      department: (value) => tDept(value),
      branch: (value) => tBranch(value),
      type: (value) => tType(value),
    });
  }, [
    pending,
    superAdmin,
    departmentFilter,
    branchFilter,
    searchQuery,
    tDept,
    tBranch,
    tType,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredPending.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedPending = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredPending.slice(start, start + PAGE_SIZE);
  }, [filteredPending, safePage]);

  const approveRequest = approveId
    ? pending.find((item) => item.id === approveId) ?? null
    : null;
  const rejectRequest = rejectId
    ? pending.find((item) => item.id === rejectId) ?? null
    : null;
  const viewRequest: DemoRequest | null = viewId
    ? pending.find((item) => item.id === viewId) ?? null
    : null;

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
    superAdmin && (departmentFilter !== "all" || branchFilter !== "all");

  const clearFilters = (): void => {
    setDepartmentFilter("all");
    setBranchFilter("all");
    setPage(1);
  };

  const confirmApprove = (): void => {
    if (!approveId) return;
    setRequestStatus(approveId, "approved");
    setApproveId(null);
  };

  const confirmReject = (): void => {
    if (!rejectId) return;
    setRequestStatus(rejectId, "rejected");
    setRejectId(null);
  };

  const columnCount = superAdmin ? 7 : 5;
  const emptyMessage =
    pending.length === 0 ? t("emptyPending") : t("noSearchResults");

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
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={t("searchPlaceholder")}
              startIcon={<Search />}
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <div className="flex flex-col gap-3 lg:min-w-0 lg:flex-1 lg:flex-row lg:items-center lg:gap-3">
            {superAdmin ? (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="min-w-0 flex-1 lg:w-40 lg:flex-none">
                    <MainSelect
                      value={branchFilter}
                      onValueChange={handleBranchFilterChange}
                      options={branchOptions}
                      placeholder={tFilters("branch")}
                    />
                  </div>
                  <div className="min-w-0 flex-1 lg:w-40 lg:flex-none">
                    <MainSelect
                      value={departmentFilter}
                      onValueChange={handleDepartmentFilterChange}
                      options={departmentOptions}
                      placeholder={tFilters("department")}
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
                    {tFilters("clear")}
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
                  {tFilters("clear")}
                </MainButton>
              ) : null}
              <h2 className="ms-auto shrink-0 text-sm font-semibold text-ink lg:ms-0">
                {t("pendingTitle", { count: filteredPending.length })}
              </h2>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
          <div className="admin-scroll-visible overflow-x-auto">
            <table
              className={cn(
                "w-full border-collapse text-sm",
                superAdmin ? "min-w-[960px]" : "min-w-[640px]"
              )}
            >
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                    {t("columns.employee")}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                    {t("columns.type")}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                    {t("columns.dates")}
                  </th>
                  {superAdmin ? (
                    <>
                      <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                        {t("columns.branch")}
                      </th>
                      <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                        {t("columns.department")}
                      </th>
                    </>
                  ) : null}
                  <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                    {t("columns.submitted")}
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-text-muted">
                    {t("columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedPending.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-4 py-10 text-center text-sm text-text-muted"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  pagedPending.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 text-start">
                        <p className="font-medium text-ink">{request.employeeName}</p>
                      </td>
                      <td className="px-4 py-3 text-start">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            leaveTypeSurface[request.type].soft
                          )}
                        >
                          {tType(request.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {formatRequestDates(request.from, request.to)}
                      </td>
                      {superAdmin ? (
                        <>
                          <td className="px-4 py-3 text-start text-text-secondary">
                            {tBranch(request.branch)}
                          </td>
                          <td className="px-4 py-3 text-start text-text-secondary">
                            {tDept(request.department)}
                          </td>
                        </>
                      ) : null}
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {request.createdAt}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-start gap-2">
                          <MainButton
                            variant="edit-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("view")}
                            startIcon={<Eye className="size-4" />}
                            onClick={() => setViewId(request.id)}
                          />
                          <MainButton
                            variant="add-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("approve")}
                            startIcon={<Check className="size-4" />}
                            onClick={() => setApproveId(request.id)}
                          />
                          <MainButton
                            variant="delete-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("reject")}
                            startIcon={<X className="size-4" />}
                            onClick={() => setRejectId(request.id)}
                          />
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
            totalItems={filteredPending.length}
            onPageChange={setPage}
            previousLabel={t("pagination.previous")}
            nextLabel={t("pagination.next")}
            formatSummary={({ start, end, total }) =>
              t("pagination.summary", { start, end, total })
            }
          />
        </div>
      </section>

      <LeaveRequestViewModal
        open={viewRequest !== null}
        request={viewRequest}
        superAdmin={superAdmin}
        onClose={() => setViewId(null)}
      />

      <DeleteConfirmModal
        open={approveRequest !== null}
        title={t("approveTitle")}
        description={
          approveRequest
            ? t("approveDescription", { name: approveRequest.employeeName })
            : ""
        }
        confirmLabel={t("approveConfirm")}
        cancelLabel={t("cancel")}
        confirmVariant="add-soft"
        onCancel={() => setApproveId(null)}
        onConfirm={confirmApprove}
      />

      <DeleteConfirmModal
        open={rejectRequest !== null}
        title={t("rejectTitle")}
        description={
          rejectRequest
            ? t("rejectDescription", { name: rejectRequest.employeeName })
            : ""
        }
        confirmLabel={t("rejectConfirm")}
        cancelLabel={t("cancel")}
        confirmVariant="delete-soft"
        onCancel={() => setRejectId(null)}
        onConfirm={confirmReject}
      />
    </div>
  );
}
