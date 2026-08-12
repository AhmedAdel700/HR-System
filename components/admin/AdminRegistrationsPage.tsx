"use client";

import { useMemo, useState, useSyncExternalStore, type MouseEvent, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Check, Search, X } from "lucide-react";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import { TablePagination } from "@/components/shared/TablePagination";
import {
  getRegistrationsSnapshot,
  setRegistrationStatus,
  subscribeRegistrations,
} from "@/lib/admin/adminDataStore";
import {
  getAdminSessionSnapshot,
  subscribeAdminSession,
} from "@/lib/admin/adminSessionStore";
import { filterRegistrationsForAdmin } from "@/lib/admin/permissions";
import { searchRegistrationRequests } from "@/lib/admin/searchRegistrationRequests";
import { useModalTriggerRef } from "@/lib/useModalTriggerRef";

const PAGE_SIZE = 5;

export function AdminRegistrationsPage(): ReactElement {
  const t = useTranslations("admin.registrations");
  const tDept = useTranslations("admin.departments");
  const tBranch = useTranslations("auth.branchOptions");

  useSyncExternalStore(subscribeAdminSession, getAdminSessionSnapshot, getAdminSessionSnapshot);
  useSyncExternalStore(
    subscribeRegistrations,
    getRegistrationsSnapshot,
    getRegistrationsSnapshot
  );

  const admin = getAdminSessionSnapshot();
  const allRequests = getRegistrationsSnapshot();
  const requests = filterRegistrationsForAdmin(admin, allRequests);

  const pending = requests.filter((item) => item.status === "pending");

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const { triggerRef: approveRegistrationTriggerRef, bindTrigger: bindApproveRegistrationTrigger } =
    useModalTriggerRef();
  const { triggerRef: rejectRegistrationTriggerRef, bindTrigger: bindRejectRegistrationTrigger } =
    useModalTriggerRef();

  const filteredPending = useMemo(
    () =>
      searchRegistrationRequests(pending, searchQuery, {
        department: (value) => tDept(value),
        branch: (value) => tBranch(value),
      }),
    [pending, searchQuery, tDept, tBranch]
  );

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

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
    setPage(1);
  };

  const confirmApprove = (): boolean => {
    if (!approveId) return false;
    setRegistrationStatus(approveId, "approved");
    return true;
  };

  const confirmReject = (): boolean => {
    if (!rejectId) return false;
    setRegistrationStatus(rejectId, "rejected");
    return true;
  };

  const columnCount = 7;
  const emptyMessage =
    pending.length === 0
      ? t("emptyPending")
      : t("noSearchResults");

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-xs">
            <MainInput
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={t("searchPlaceholder")}
              startIcon={<Search />}
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <h2 className="self-end text-sm font-semibold text-ink lg:self-auto">
            {t("pendingTitle", { count: pending.length })}
          </h2>
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
                    {t("columns.position")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.department")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.branch")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.submitted")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
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
                        <p className="font-medium text-ink">{request.name}</p>
                      </td>
                      <td className="px-4 py-3 text-start">
                        <p className="text-ink">{request.email}</p>
                        <p className="text-xs text-text-muted">{request.phone}</p>
                        <p className="text-xs font-mono tabular-nums text-text-muted">
                          {request.fingerprintNumber}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {request.position}
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {tDept(request.department)}
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {tBranch(request.branch)}
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {request.submittedAt}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-start gap-2">
                          <MainButton
                            variant="add-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("approve")}
                            startIcon={<Check className="size-4" />}
                            onClick={(event) => {
                              bindApproveRegistrationTrigger(event);
                              setApproveId(request.id);
                            }}
                          />
                          <MainButton
                            variant="delete-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("reject")}
                            startIcon={<X className="size-4" />}
                            onClick={(event) => {
                              bindRejectRegistrationTrigger(event);
                              setRejectId(request.id);
                            }}
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

      <DeleteConfirmModal
        open={approveRequest !== null}
        title={t("approveTitle")}
        description={
          approveRequest
            ? t("approveDescription", { name: approveRequest.name })
            : ""
        }
        confirmLabel={t("approveConfirm")}
        cancelLabel={t("cancel")}
        confirmVariant="add-soft"
        onCancel={() => setApproveId(null)}
        onConfirm={confirmApprove}
        triggerRef={approveRegistrationTriggerRef}
      />

      <DeleteConfirmModal
        open={rejectRequest !== null}
        title={t("rejectTitle")}
        description={
          rejectRequest
            ? t("rejectDescription", { name: rejectRequest.name })
            : ""
        }
        confirmLabel={t("rejectConfirm")}
        cancelLabel={t("cancel")}
        confirmVariant="delete-soft"
        onCancel={() => setRejectId(null)}
        onConfirm={confirmReject}
        triggerRef={rejectRegistrationTriggerRef}
      />
    </div>
  );
}
