"use client";

import { useMemo, useState, useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { CreateBranchModal } from "@/components/admin/CreateBranchModal";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { MainButton } from "@/components/shared/MainButton";
import { ModalBackdrop } from "@/components/shared/ModalBackdrop";
import { MainInput } from "@/components/shared/MainInput";
import { buildBranchOverviews } from "@/lib/admin/buildBranchOverviews";
import {
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";
import {
  deleteBranch,
  getBranchesSnapshot,
  subscribeOrg,
  updateBranch,
} from "@/lib/admin/adminOrgStore";
import { searchBranchRows } from "@/lib/admin/searchBranchRows";
import type { AdminBranchRecord } from "@/types/AdminApiTypes";

interface BranchTableRow {
  branch: AdminBranchRecord;
  departmentCount: number;
  employeeCount: number;
}

export function AdminBranchesPage(): ReactElement {
  const t = useTranslations("admin.branchesPage");
  const router = useRouter();

  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);
  useSyncExternalStore(subscribeOrg, getBranchesSnapshot, getBranchesSnapshot);

  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<AdminBranchRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [draft, setDraft] = useState<UpdateBranchDraft>(emptyDraft());

  const overviews = buildBranchOverviews(getEmployeesSnapshot());
  const branchRows: BranchTableRow[] = getBranchesSnapshot().map((branch) => {
    const overview = overviews.find((item) => item.branch === branch.slug);
    return {
      branch,
      departmentCount: overview?.departments.length ?? 0,
      employeeCount: overview?.employeeCount ?? 0,
    };
  });

  const filteredBranchRows = useMemo(
    () => searchBranchRows(branchRows, searchQuery),
    [branchRows, searchQuery]
  );

  const deleteTarget = deleteId
    ? branchRows.find((row) => row.branch.id === deleteId)?.branch ?? null
    : null;

  const openEdit = (branch: AdminBranchRecord): void => {
    setEditing(branch);
    setDraft({
      name: branch.name,
      city: branch.city,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
    });
  };

  const saveEdit = (): void => {
    if (!editing) return;
    updateBranch(editing.id, draft);
    setEditing(null);
    setDraft(emptyDraft());
  };

  const confirmDelete = (): void => {
    if (!deleteId) return;
    const result = deleteBranch(deleteId);
    if (!result.success) {
      if (result.reason === "has_employees") {
        setDeleteError(t("deleteBlockedEmployees"));
      } else if (result.reason === "has_departments") {
        setDeleteError(t("deleteBlockedDepartments"));
      } else {
        setDeleteError(t("branchNotFoundDescription"));
      }
      return;
    }
    setDeleteId(null);
    setDeleteError(null);
  };

  const columnCount = 6;

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
              {t("branchesTitle", { count: filteredBranchRows.length })}
            </h2>
            <MainButton
              variant="primary"
              size="sm"
              startIcon={<Plus className="size-4" />}
              onClick={() => setCreating(true)}
            >
              {t("createBranch")}
            </MainButton>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
          <div className="admin-scroll-visible overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60">
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.branch")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.city")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.contact")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.departments")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.employees")}
                  </th>
                  <th className="px-4 py-4 text-start text-xs font-semibold text-text-muted">
                    {t("columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBranchRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-4 py-10 text-center text-sm text-text-muted"
                    >
                      {branchRows.length === 0
                        ? t("emptyBranches")
                        : t("emptySearch")}
                    </td>
                  </tr>
                ) : (
                  filteredBranchRows.map(({ branch, departmentCount, employeeCount }) => (
                    <tr
                      key={branch.id}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-4 py-3 text-start font-medium text-ink">
                        {branch.name}
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {branch.city}
                      </td>
                      <td className="px-4 py-3 text-start">
                        <p className="text-ink">{branch.email}</p>
                        <p className="text-xs text-text-muted">{branch.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {departmentCount}
                      </td>
                      <td className="px-4 py-3 text-start text-text-secondary">
                        {employeeCount}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-start gap-2">
                          <MainButton
                            variant="edit-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("view")}
                            startIcon={<Eye className="size-4" />}
                            onClick={() =>
                              router.push(
                                `/admin-dashboard/branches/${branch.id}`
                              )
                            }
                          />
                          <MainButton
                            variant="edit-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("edit")}
                            startIcon={<Pencil className="size-4" />}
                            onClick={() => openEdit(branch)}
                          />
                          <MainButton
                            variant="delete-soft"
                            size="sm"
                            iconOnly
                            aria-label={t("delete")}
                            startIcon={<Trash2 className="size-4" />}
                            onClick={() => {
                              setDeleteError(null);
                              setDeleteId(branch.id);
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

      {editing ? (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
          <ModalBackdrop
            ariaLabel={t("cancel")}
            onClick={() => setEditing(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-4 shadow-md">
              <h2 className="text-base font-semibold text-ink">{t("editTitle")}</h2>
              <div className="mt-4 flex flex-col gap-3">
                <MainInput
                  label={t("fields.name")}
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <MainInput
                  label={t("fields.city")}
                  value={draft.city}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, city: event.target.value }))
                  }
                />
                <MainInput
                  as="textarea"
                  label={t("fields.address")}
                  value={draft.address}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, address: event.target.value }))
                  }
                />
                <MainInput
                  label={t("fields.phone")}
                  type="tel"
                  value={draft.phone}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
                <MainInput
                  label={t("fields.email")}
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <MainButton variant="neutral" block onClick={() => setEditing(null)}>
                  {t("cancel")}
                </MainButton>
                <MainButton variant="primary" block onClick={saveEdit}>
                  {t("save")}
                </MainButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <CreateBranchModal open={creating} onClose={() => setCreating(false)} />

      <DeleteConfirmModal
        open={deleteTarget !== null}
        title={t("deleteTitle")}
        description={
          deleteError ??
          (deleteTarget
            ? t("deleteDescription", { name: deleteTarget.name })
            : "")
        }
        confirmLabel={t("deleteConfirm")}
        cancelLabel={t("cancel")}
        onCancel={() => {
          setDeleteId(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

interface UpdateBranchDraft {
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

function emptyDraft(): UpdateBranchDraft {
  return {
    name: "",
    city: "",
    address: "",
    phone: "",
    email: "",
  };
}
