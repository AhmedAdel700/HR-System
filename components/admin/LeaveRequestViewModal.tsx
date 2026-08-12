"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactElement, ReactNode, RefObject } from "react";
import { MainButton } from "@/components/shared/MainButton";
import { ModalShell } from "@/components/shared/ModalShell";
import { useGenieModalClose } from "@/components/shared/GenieModalShell";
import { leaveTypeSurface, type DemoRequest } from "@/lib/employee/demo-data";
import { formatStoredTime12, resolveTimeLocale } from "@/lib/formatTime";
import { cn } from "@/lib/utils";

interface LeaveRequestViewModalProps {
  open: boolean;
  request: DemoRequest | null;
  superAdmin: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
}

function formatRequestDates(from: string, to: string): string {
  return from === to ? from : `${from} → ${to}`;
}

function DetailField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}): ReactElement {
  return (
    <div className={className}>
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{children}</dd>
    </div>
  );
}

export function LeaveRequestViewModal({
  open,
  request,
  superAdmin,
  onClose,
  triggerRef,
}: LeaveRequestViewModalProps): ReactElement | null {
  const t = useTranslations("admin.leaveRequests");

  if (!request) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      triggerRef={triggerRef}
      backdropAriaLabel={t("close")}
      role="dialog"
      ariaModal
      ariaLabelledBy="leave-request-view-title"
      panelClassName="flex max-w-lg max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-0"
    >
      <LeaveRequestViewContent
        request={request}
        superAdmin={superAdmin}
        onClose={onClose}
      />
    </ModalShell>
  );
}

interface LeaveRequestViewContentProps {
  request: DemoRequest;
  superAdmin: boolean;
  onClose: () => void;
}

function LeaveRequestViewContent({
  request,
  superAdmin,
  onClose,
}: LeaveRequestViewContentProps): ReactElement {
  const t = useTranslations("admin.leaveRequests");
  const closeModal = useGenieModalClose(onClose);
  const locale = useLocale();
  const tFields = useTranslations("employee.requests");
  const tDept = useTranslations("admin.departments");
  const tBranch = useTranslations("auth.branchOptions");
  const tType = useTranslations("employee.requests.types");

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                leaveTypeSurface[request.type].soft,
              )}
            >
              {tType(request.type)}
            </span>
            <h2
              id="leave-request-view-title"
              className="text-base font-semibold text-ink"
            >
              {t("detailTitle")}
            </h2>
          </div>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 rounded-xl border border-border bg-surface-muted/30 p-3 sm:grid-cols-2">
            <DetailField label={t("columns.employee")}>
              <span className="font-medium">{request.employeeName}</span>
            </DetailField>
            <DetailField label={tFields("dates")}>
              <span className="font-medium">
                {formatRequestDates(request.from, request.to)}
              </span>
            </DetailField>
            {request.startTime && request.endTime ? (
              <DetailField label={tFields("hours")}>
                <span className="font-medium">
                  {formatStoredTime12(request.startTime, resolveTimeLocale(locale))} →{" "}
                  {formatStoredTime12(request.endTime, resolveTimeLocale(locale))}
                </span>
              </DetailField>
            ) : null}
            {superAdmin ? (
              <>
                <DetailField label={t("columns.branch")}>
                  <span className="text-text-secondary">
                    {tBranch(request.branch)}
                  </span>
                </DetailField>
                <DetailField label={t("columns.department")}>
                  <span className="text-text-secondary">
                    {tDept(request.department)}
                  </span>
                </DetailField>
              </>
            ) : null}
            <DetailField label={tFields("createdAt")}>
              <span className="font-medium">{request.createdAt}</span>
            </DetailField>
            <DetailField label={tFields("reason")} className="sm:col-span-2">
              <span className="text-text-secondary">{request.reason}</span>
            </DetailField>
            {request.note ? (
              <DetailField label={tFields("note")} className="sm:col-span-2">
                <span className="text-text-secondary">{request.note}</span>
              </DetailField>
            ) : null}
          </dl>
        </div>
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <MainButton variant="neutral" block onClick={closeModal}>
          {t("close")}
        </MainButton>
      </div>
    </>
  );
}
