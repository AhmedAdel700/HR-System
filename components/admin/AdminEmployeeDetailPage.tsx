"use client";

import { useMemo, useState, useSyncExternalStore, type ReactElement, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Hash,
  Mail,
  MapPinned,
  Fingerprint,
  Pencil,
  Phone,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { AttendanceHistorySection } from "@/components/employee/AttendanceHistorySection";
import { LeaveStatsSection } from "@/components/employee/LeaveStatsSection";
import { EditEmployeeAssignmentModal } from "@/components/admin/EditEmployeeAssignmentModal";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { MainButton } from "@/components/shared/MainButton";
import { getBranchDisplayName } from "@/lib/admin/buildBranchOverviews";
import {
  deleteEmployee,
  getEmployeeById,
  getEmployeesSnapshot,
  subscribeEmployees,
} from "@/lib/admin/adminDataStore";
import { getDepartmentManagerName } from "@/lib/admin/departmentManagers";
import {
  getAdminSessionSnapshot,
  subscribeAdminSession,
} from "@/lib/admin/adminSessionStore";
import { getBranchesSnapshot, getBranchDepartmentsSnapshot, subscribeOrg } from "@/lib/admin/adminOrgStore";
import {
  canManageEmployees,
  canViewEmployee,
  isSuperAdmin,
} from "@/lib/admin/permissions";
import { getEmployeeAttendanceHistoryMonths } from "@/lib/employee/attendanceHistory";
import type { LucideIcon } from "lucide-react";

export function AdminEmployeeDetailPage(): ReactElement {
  const t = useTranslations("admin.employeeDetailPage");
  const tEmployees = useTranslations("admin.employees");
  const tDept = useTranslations("admin.departments");
  const tBranch = useTranslations("auth.branchOptions");
  const router = useRouter();
  const params = useParams();

  useSyncExternalStore(subscribeAdminSession, getAdminSessionSnapshot, getAdminSessionSnapshot);
  useSyncExternalStore(subscribeEmployees, getEmployeesSnapshot, getEmployeesSnapshot);
  useSyncExternalStore(subscribeOrg, getBranchesSnapshot, getBranchesSnapshot);

  const employeeParam = params.employeeId;
  const employeeId = typeof employeeParam === "string" ? employeeParam : "";
  const admin = getAdminSessionSnapshot();
  const employee = employeeId ? getEmployeeById(employeeId) : undefined;
  const canView = employee ? canViewEmployee(admin, employee) : false;
  const canEdit = canManageEmployees(admin.role);
  const canDelete = isSuperAdmin(admin.role);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const attendanceMonths = useMemo(
    () =>
      employee
        ? getEmployeeAttendanceHistoryMonths(employee.id, 4, new Date(2026, 7, 10))
        : [],
    [employee]
  );

  if (!employee || !canView) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-xs">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("notFoundTitle")}
        </h1>
        <p className="text-sm text-text-secondary">{t("notFoundDescription")}</p>
        <MainButton variant="primary" size="sm" link="/admin-dashboard/employees">
          {t("backToEmployees")}
        </MainButton>
      </div>
    );
  }

  const branchName = getBranchDisplayName(
    employee.branch,
    getBranchesSnapshot(),
    (value) => tBranch(value)
  );

  const departmentRecord = getBranchDepartmentsSnapshot().find(
    (department) => department.slug === employee.department
  );
  const departmentName = departmentRecord?.name ?? tDept(employee.department);

  const handleDelete = (): void => {
    const deleted = deleteEmployee(employee.id);
    if (!deleted) return;
    setDeleteOpen(false);
    router.push("/admin-dashboard/employees");
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <MainButton
          variant="ghost-brand"
          size="sm"
          startIcon={<ArrowLeft className="size-4 rtl:rotate-180" />}
          link="/admin-dashboard/employees"
        >
          {t("backToEmployees")}
        </MainButton>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            {employee.name}
          </h1>
          <p className="text-sm text-text-secondary">
            {t("subtitle", { position: employee.position })}
          </p>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard title={t("sections.work")} icon={Briefcase}>
          <DetailField
            label={t("fields.department")}
            value={departmentName}
            icon={Users}
          />
          <DetailField
            label={t("fields.branch")}
            value={branchName}
            icon={MapPinned}
          />
          <DetailField
            label={t("fields.position")}
            value={employee.position}
            icon={UserRound}
          />
          <DetailField
            label={t("fields.departmentManager")}
            value={getDepartmentManagerName(employee.department)}
            icon={UserRound}
          />
        </InfoCard>

        <InfoCard title={t("sections.contact")} icon={Mail}>
          <DetailField
            label={t("fields.email")}
            value={employee.email}
            icon={Mail}
          />
          <DetailField
            label={t("fields.phone")}
            value={employee.phone}
            icon={Phone}
          />
        </InfoCard>

        <InfoCard title={t("sections.employment")} icon={CalendarDays}>
          <DetailField
            label={t("fields.employeeId")}
            value={employee.id}
            icon={Hash}
          />
          <DetailField
            label={t("fields.fingerprintNumber")}
            value={employee.fingerprintNumber}
            icon={Fingerprint}
          />
          <DetailField
            label={t("fields.joinDate")}
            value={employee.joinedAt}
            icon={CalendarDays}
          />
        </InfoCard>
      </div>

      <LeaveStatsSection employeeId={employee.id} />

      <AttendanceHistorySection months={attendanceMonths} />

      {(canEdit || canDelete) ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {canEdit ? (
            <MainButton
              variant="primary"
              block
              startIcon={<Pencil className="size-4" />}
              onClick={() => setEditOpen(true)}
            >
              {tEmployees("edit")}
            </MainButton>
          ) : null}

          {canDelete ? (
            <MainButton
              variant="delete"
              block
              startIcon={<Trash2 className="size-4" />}
              onClick={() => setDeleteOpen(true)}
            >
              {t("deleteEmployee")}
            </MainButton>
          ) : null}
        </div>
      ) : null}

      <DeleteConfirmModal
        open={deleteOpen}
        title={tEmployees("deleteTitle")}
        description={tEmployees("deleteDescription")}
        confirmLabel={tEmployees("deleteConfirm")}
        cancelLabel={tEmployees("cancel")}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      {employee && canEdit ? (
        <EditEmployeeAssignmentModal
          employee={employee}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      ) : null}
    </div>
  );
}

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

function InfoCard({ title, icon: Icon, children }: InfoCardProps): ReactElement {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      <header className="flex items-center gap-2.5 border-b border-border bg-surface-muted/50 px-4 py-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700">
          <Icon className="size-4" aria-hidden />
        </span>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
      </header>
      <dl className="flex flex-1 flex-col gap-3 p-4">{children}</dl>
    </section>
  );
}

function DetailField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}): ReactElement {
  return (
    <div className="rounded-xl border border-border/80 bg-surface-muted/30 px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
