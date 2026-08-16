"use client";

import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactElement,
} from "react";
import { useTranslations } from "next-intl";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { CreatePositionModal } from "@/components/admin/CreatePositionModal";
import { EditPositionModal } from "@/components/admin/EditPositionModal";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { MainButton } from "@/components/shared/MainButton";
import { MainInput } from "@/components/shared/MainInput";
import {
  deletePosition,
  getPositionsSnapshot,
  subscribePositions,
} from "@/lib/admin/positionsStore";
import { useModalTriggerRef } from "@/lib/useModalTriggerRef";
import type { PositionRecord } from "@/types/PositionsApiTypes";

export function AdminPositionsPage(): ReactElement {
  const t = useTranslations("admin.positionsPage");

  useSyncExternalStore(subscribePositions, getPositionsSnapshot, getPositionsSnapshot);

  const positions = getPositionsSnapshot();
  const createPositionTriggerRef = useRef<HTMLButtonElement>(null);
  const { triggerRef: editPositionTriggerRef, bindTrigger: bindEditPositionTrigger } =
    useModalTriggerRef();
  const { triggerRef: deletePositionTriggerRef, bindTrigger: bindDeletePositionTrigger } =
    useModalTriggerRef();

  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<PositionRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredPositions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return positions;
    return positions.filter(
      (position) =>
        position.name.toLowerCase().includes(query) ||
        position.slug.toLowerCase().includes(query),
    );
  }, [positions, searchQuery]);

  const deleteTarget = deleteId
    ? positions.find((item) => item.id === deleteId) ?? null
    : null;

  const openEdit = (
    position: PositionRecord,
    event: MouseEvent<HTMLButtonElement>,
  ): void => {
    bindEditPositionTrigger(event);
    setEditing(position);
  };

  const confirmDelete = (): boolean => {
    if (!deleteId) return false;
    const result = deletePosition(deleteId);
    return result.success;
  };

  const columnCount = 2;

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
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              startIcon={<Search />}
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <h2 className="text-sm font-semibold text-ink">
              {t("resultsTitle", { count: filteredPositions.length })}
            </h2>
            <MainButton
              ref={createPositionTriggerRef}
              variant="primary"
              size="sm"
              startIcon={<Plus className="size-4" />}
              onClick={() => setCreating(true)}
            >
              {t("create")}
            </MainButton>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
          <div className="admin-scroll-visible overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className="w-full px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.name")}
                  </th>
                  <th className="px-4 py-4 text-end text-xs font-semibold text-text-muted">
                    {t("columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-4 py-10 text-center text-sm text-text-muted"
                    >
                      {positions.length === 0 ? t("empty") : t("noResults")}
                    </td>
                  </tr>
                ) : (
                  filteredPositions.map((position) => (
                    <tr
                      key={position.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 text-start font-medium text-ink">
                        {position.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <MainButton
                            variant="edit-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("edit")}
                            startIcon={<Pencil className="size-4" />}
                            onClick={(event) => openEdit(position, event)}
                          />
                          <MainButton
                            variant="delete-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("delete")}
                            startIcon={<Trash2 className="size-4" />}
                            onClick={(event) => {
                              bindDeletePositionTrigger(event);
                              setDeleteId(position.id);
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
        </div>
      </section>

      <CreatePositionModal
        open={creating}
        onClose={() => setCreating(false)}
        triggerRef={createPositionTriggerRef}
      />

      {editing ? (
        <EditPositionModal
          position={editing}
          open={editing !== null}
          onClose={() => setEditing(null)}
          triggerRef={editPositionTriggerRef}
        />
      ) : null}

      <DeleteConfirmModal
        open={deleteTarget !== null}
        title={t("deleteTitle")}
        description={
          deleteTarget
            ? t("deleteDescription", { name: deleteTarget.name })
            : ""
        }
        confirmLabel={t("deleteConfirm")}
        cancelLabel={t("cancel")}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        triggerRef={deletePositionTriggerRef}
      />
    </div>
  );
}
