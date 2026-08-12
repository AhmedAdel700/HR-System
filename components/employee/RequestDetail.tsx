"use client";

import { useRef, useState, useSyncExternalStore, type ReactElement } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { MainButton } from "@/components/shared/MainButton";
import { leaveTypeSurface } from "@/lib/employee/demo-data";
import {
  canModifyRequest,
  deleteRequest,
  getEmployeeRequestById,
  getEmployeeRequestsSnapshot,
  subscribeRequests,
} from "@/lib/employee/requestsStore";
import { formatStoredTime12, resolveTimeLocale } from "@/lib/formatTime";
import { cn } from "@/lib/utils";

export function RequestDetail({ id }: { id: string }): ReactElement {
  const t = useTranslations("employee.requests");
  const locale = useLocale();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deleteRequestTriggerRef = useRef<HTMLButtonElement>(null);

  useSyncExternalStore(
    subscribeRequests,
    getEmployeeRequestsSnapshot,
    getEmployeeRequestsSnapshot
  );
  const item = getEmployeeRequestById(id);

  if (!item) {
    notFound();
  }

  const canModify = canModifyRequest(item.status);

  const handleDelete = (): boolean => {
    setDeleting(true);
    const removed = deleteRequest(id);
    setDeleting(false);
    if (removed) {
      router.push("/requests");
    }
    return removed;
  };

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            leaveTypeSurface[item.type].soft
          )}
        >
          {t(`types.${item.type}`)}
        </span>
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          {t("detail")}
        </h1>
      </section>

      <dl className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <dt className="text-xs text-text-muted">{t("dates")}</dt>
            <dd className="mt-1 text-sm font-medium text-ink">
              {item.from === item.to ? item.from : `${item.from} → ${item.to}`}
            </dd>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              item.status === "pending" && "bg-warning-50 text-warning-700",
              item.status === "approved" && "bg-success-50 text-success-700",
              item.status === "rejected" && "bg-danger-50 text-danger-700"
            )}
          >
            {t(`status.${item.status}`)}
          </span>
        </div>
        {item.startTime && item.endTime ? (
          <div>
            <dt className="text-xs text-text-muted">{t("hours")}</dt>
            <dd className="mt-1 text-sm font-medium text-ink">
              {formatStoredTime12(item.startTime, resolveTimeLocale(locale))} →{" "}
              {formatStoredTime12(item.endTime, resolveTimeLocale(locale))}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs text-text-muted">{t("reason")}</dt>
          <dd className="mt-1 text-sm text-text-secondary">{item.reason}</dd>
        </div>
        {item.note ? (
          <div>
            <dt className="text-xs text-text-muted">{t("note")}</dt>
            <dd className="mt-1 text-sm text-text-secondary">{item.note}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs text-text-muted">{t("createdAt")}</dt>
          <dd className="mt-1 text-sm font-medium text-ink">{item.createdAt}</dd>
        </div>
      </dl>

      {canModify ? (
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          <MainButton
            variant="edit"
            block
            link={`/requests/${item.id}/edit`}
            startIcon={<Pencil className="size-4" />}
          >
            {t("edit")}
          </MainButton>
          <MainButton
            ref={deleteRequestTriggerRef}
            variant="delete-soft"
            block
            startIcon={<Trash2 className="size-4" />}
            onClick={() => setConfirmOpen(true)}
          >
            {t("delete")}
          </MainButton>
        </div>
      ) : null}

      <Link
        href="/requests"
        className="inline-flex text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        {t("back")}
      </Link>

      <DeleteConfirmModal
        open={confirmOpen}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={t("deleteConfirm")}
        cancelLabel={t("deleteCancel")}
        loading={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        triggerRef={deleteRequestTriggerRef}
      />
    </div>
  );
}
