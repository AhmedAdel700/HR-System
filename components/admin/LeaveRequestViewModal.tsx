"use client";

import { useTranslations } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import { MainButton } from "@/components/shared/MainButton";
import { leaveTypeSurface, type DemoRequest } from "@/lib/employee/demo-data";
import { cn } from "@/lib/utils";

interface LeaveRequestViewModalProps {
  open: boolean;
  request: DemoRequest | null;
  superAdmin: boolean;
  onClose: () => void;
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
}: LeaveRequestViewModalProps): ReactElement | null {
  const t = useTranslations("admin.leaveRequests");
  const tFields = useTranslations("employee.requests");
  const tDept = useTranslations("admin.departments");
  const tBranch = useTranslations("auth.branchOptions");
  const tType = useTranslations("employee.requests.types");

  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 cursor-pointer bg-ink/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-request-view-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-md"
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                leaveTypeSurface[request.type].soft
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

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-border bg-surface-muted/30 p-3">
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
                  {request.startTime} → {request.endTime}
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
            <DetailField label={tFields("reason")} className="col-span-2">
              <span className="text-text-secondary">{request.reason}</span>
            </DetailField>
            {request.note ? (
              <DetailField label={tFields("note")} className="col-span-2">
                <span className="text-text-secondary">{request.note}</span>
              </DetailField>
            ) : null}
          </dl>
        </div>

        <div className="mt-4">
          <MainButton variant="neutral" block onClick={onClose}>
            {t("close")}
          </MainButton>
        </div>
      </div>
    </div>
  );
}
