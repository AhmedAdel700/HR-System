"use client";

import { useSyncExternalStore, type ReactElement, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  MapPinned,
  UserPlus,
  Users,
} from "lucide-react";
import { MainButton } from "@/components/shared/MainButton";
import {
  getAdminSessionSnapshot,
  subscribeAdminSession,
} from "@/lib/admin/adminSessionStore";
import {
  getEmployeesSnapshot,
  getRegistrationsSnapshot,
  subscribeEmployees,
  subscribeRegistrations,
} from "@/lib/admin/adminDataStore";
import {
  filterEmployeesForAdmin,
  filterLeaveRequestsForAdmin,
  filterRegistrationsForAdmin,
  isSuperAdmin,
} from "@/lib/admin/permissions";
import {
  getRequestsSnapshot,
  subscribeRequests,
} from "@/lib/employee/requestsStore";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewStatItem {
  key: string;
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
}

function getOverviewStatGridClass(count: number): string {
  const columns = Math.min(Math.max(count, 1), 4);

  if (columns === 1) return "grid-cols-1";
  if (columns === 2) return "grid-cols-1 sm:grid-cols-2";
  if (columns === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
}): ReactElement {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-primary-50/15 p-4 shadow-xs">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-primary-500/6 to-transparent" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-ink">
            {value}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
            {hint}
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-50/80 text-primary-500 shadow-xs">
          <Icon className="size-5 text-primary-500" strokeWidth={1.75} />
        </span>
      </div>
    </article>
  );
}

function OverviewAttentionPanel({
  title,
  subtitle,
  count,
  emptyMessage,
  viewAllLabel,
  viewAllHref,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  emptyMessage: string;
  viewAllLabel: string;
  viewAllHref: string;
  children: ReactNode;
}): ReactElement {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
        </div>
        {count > 0 ? (
          <span className="rounded-full bg-warning-50 px-2.5 py-0.5 text-[11px] font-semibold text-warning-700">
            {count}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex-1">
        {count > 0 ? (
          <ul className="space-y-2">{children}</ul>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-text-muted">
            {emptyMessage}
          </p>
        )}
      </div>

      <MainButton
        variant="ghost-brand"
        size="sm"
        block
        link={viewAllHref}
        className="mt-3 shrink-0"
      >
        {viewAllLabel}
      </MainButton>
    </section>
  );
}

function formatRequestDates(from: string, to: string): string {
  return from === to ? from : `${from} → ${to}`;
}

export function AdminOverview(): ReactElement {
  const t = useTranslations("admin.overview");
  const tDept = useTranslations("admin.departments");
  const tBranch = useTranslations("auth.branchOptions");
  const tLeaveType = useTranslations("employee.requests.types");

  useSyncExternalStore(subscribeAdminSession, getAdminSessionSnapshot, getAdminSessionSnapshot);
  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);
  useSyncExternalStore(subscribeRegistrations, getRegistrationsSnapshot, getRegistrationsSnapshot);
  useSyncExternalStore(subscribeRequests, getRequestsSnapshot, getRequestsSnapshot);

  const admin = getAdminSessionSnapshot();
  const superAdmin = isSuperAdmin(admin.role);
  const employees = filterEmployeesForAdmin(admin, getEmployeesSnapshot());
  const registrations = filterRegistrationsForAdmin(admin, getRegistrationsSnapshot());
  const pendingRegistrationRequests = registrations.filter(
    (item) => item.status === "pending"
  );
  const pendingRegistrations = pendingRegistrationRequests.length;
  const pendingLeaveRequests = filterLeaveRequestsForAdmin(
    admin,
    getRequestsSnapshot()
  )
    .filter((item) => item.status === "pending")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pendingLeave = pendingLeaveRequests.length;
  const departments = superAdmin
    ? new Set(employees.map((item) => item.department)).size
    : 0;
  const branches = superAdmin
    ? new Set(employees.map((item) => item.branch)).size
    : 0;
  const registrationAttentionItems = pendingRegistrationRequests.slice(0, 3);
  const leaveAttentionItems = pendingLeaveRequests.slice(0, 3);

  const statCards: OverviewStatItem[] = [
    {
      key: "employees",
      label: t("employees"),
      value: employees.length,
      hint: t("employeesHint"),
      icon: Users,
    },
    {
      key: "pendingRegistrations",
      label: t("pendingRegistrations"),
      value: pendingRegistrations,
      hint: t("pendingRegistrationsHint"),
      icon: UserPlus,
    },
  ];

  if (superAdmin) {
    statCards.push(
      {
        key: "departments",
        label: t("departments"),
        value: departments,
        hint: t("departmentsHint"),
        icon: Building2,
      },
      {
        key: "branches",
        label: t("branches"),
        value: branches,
        hint: t("branchesHint"),
        icon: MapPinned,
      }
    );
  }

  return (
    <div className="space-y-[18px]">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </section>

      <div
        className={cn(
          "grid gap-[18px]",
          getOverviewStatGridClass(statCards.length)
        )}
      >
        {statCards.map((stat) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid gap-[18px] lg:grid-cols-2">
        <OverviewAttentionPanel
          title={t("attentionTitle")}
          subtitle={t("attentionSubtitle")}
          count={pendingRegistrations}
          emptyMessage={t("attentionEmpty")}
          viewAllLabel={t("viewRegistrations")}
          viewAllHref="/admin-dashboard/registrations"
        >
          {registrationAttentionItems.map((request) => (
            <li
              key={request.id}
              className="rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5"
            >
              <p className="text-sm font-medium text-ink">{request.name}</p>
              <p className="mt-0.5 text-xs text-text-muted">
                {request.position} · {tDept(request.department)} ·{" "}
                {tBranch(request.branch)}
              </p>
            </li>
          ))}
        </OverviewAttentionPanel>

        <OverviewAttentionPanel
          title={t("leaveAttentionTitle")}
          subtitle={t("leaveAttentionSubtitle")}
          count={pendingLeave}
          emptyMessage={t("leaveAttentionEmpty")}
          viewAllLabel={t("viewLeaveRequests")}
          viewAllHref="/admin-dashboard/leave-requests"
        >
          {leaveAttentionItems.map((request) => (
            <li
              key={request.id}
              className="rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5"
            >
              <p className="text-sm font-medium text-ink">{request.employeeName}</p>
              <p className="mt-0.5 text-xs text-text-muted">
                {tLeaveType(request.type)} ·{" "}
                {formatRequestDates(request.from, request.to)}
                {superAdmin
                  ? ` · ${tBranch(request.branch)} · ${tDept(request.department)}`
                  : null}
              </p>
            </li>
          ))}
        </OverviewAttentionPanel>
      </div>
    </div>
  );
}
