"use client";

import { useSyncExternalStore, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, MapPinned } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { buildBranchOverviews } from "@/lib/admin/buildBranchOverviews";
import type { AdminBranchOverview } from "@/types/AdminApiTypes";
import {
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";
import { cn } from "@/lib/utils";

function BranchCard({
  overview,
  branchName,
  onOpen,
}: {
  overview: AdminBranchOverview;
  branchName: string;
  onOpen: () => void;
}): ReactElement {
  const t = useTranslations("admin.branchesPage");

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t("openBranch", { branch: branchName })}
      className={cn(
        "group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-primary-50/15 p-5 text-start shadow-xs",
        "transition-all duration-200 hover:border-primary-200 hover:shadow-sm"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-primary-500/8 to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {t("columns.branch")}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-ink">
            {branchName}
          </p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-50/90 text-primary-600 shadow-xs ring-1 ring-primary-100">
          <MapPinned className="size-5" strokeWidth={1.75} />
        </span>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface/90 px-3 py-3 ring-1 ring-border/60">
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-ink">
            {overview.departments.length}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            {t("columns.departments")}
          </p>
        </div>
        <div className="rounded-xl bg-surface/90 px-3 py-3 ring-1 ring-border/60">
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-ink">
            {overview.employeeCount}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            {t("columns.employees")}
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-sm font-medium text-primary-700">
          {t("viewDepartments")}
        </span>
        <ChevronRight
          className="size-4 text-primary-600 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          strokeWidth={2}
        />
      </div>
    </button>
  );
}

export function AdminBranchesPage(): ReactElement {
  const t = useTranslations("admin.branchesPage");
  const tBranch = useTranslations("auth.branchOptions");
  const router = useRouter();

  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);

  const branchOverviews = buildBranchOverviews(getEmployeesSnapshot());

  const openBranch = (branch: string): void => {
    router.push(`/admin-dashboard/branches/${branch}`);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {branchOverviews.map((overview) => (
          <BranchCard
            key={overview.branch}
            overview={overview}
            branchName={tBranch(overview.branch)}
            onOpen={() => openBranch(overview.branch)}
          />
        ))}
      </div>
    </div>
  );
}
