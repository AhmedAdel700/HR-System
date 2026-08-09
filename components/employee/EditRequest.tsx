"use client";

import { useSyncExternalStore, type ReactElement } from "react";
import { notFound } from "next/navigation";
import { RequestForm } from "@/components/employee/RequestForm";
import {
  canModifyRequest,
  getRequestById,
  getRequestsSnapshot,
  subscribeRequests,
} from "@/lib/employee/requestsStore";
import type { RequestFormValues } from "@/schemas/employee/request.schema";

export function EditRequest({ id }: { id: string }): ReactElement {
  useSyncExternalStore(
    subscribeRequests,
    getRequestsSnapshot,
    getRequestsSnapshot
  );
  const item = getRequestById(id);

  if (!item || !canModifyRequest(item.status)) {
    notFound();
  }

  const initialValues: RequestFormValues = {
    from: item.from,
    to: item.to,
    reason: item.reason,
    note: item.note ?? "",
    startTime: item.startTime ?? "",
    endTime: item.endTime ?? "",
  };

  return (
    <RequestForm
      type={item.type}
      mode="edit"
      requestId={item.id}
      initialValues={initialValues}
    />
  );
}
