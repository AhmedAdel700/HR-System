import {
  getBranchBySlug,
  getBranchDepartmentAssignment,
  getBranchDepartmentsSnapshot,
  getBranchesSnapshot,
} from "@/lib/admin/adminOrgStore";
import { isKnownBranchOption } from "@/lib/admin/demo-org-data";
import {
  countDepartmentMembers,
  getEmployeeManagerProfile,
} from "@/lib/admin/departmentUtils";
import type { BranchOption } from "@/lib/auth/register-options";
import type {
  AdminBranchDepartmentOverview,
  AdminBranchDepartmentSummary,
  AdminBranchOverview,
  AdminBranchRecord,
  AdminEmployee,
} from "@/types/AdminApiTypes";

export function isBranchOption(value: string): value is BranchOption {
  return isKnownBranchOption(value);
}

export function isRegisteredBranchSlug(value: string): boolean {
  return getBranchBySlug(value) !== undefined;
}

export function isRegisteredDepartmentSlug(
  branchSlug: string,
  departmentSlug: string
): boolean {
  return getBranchDepartmentAssignment(branchSlug, departmentSlug) !== undefined;
}

export function getBranchDisplayName(
  slug: string,
  branches: readonly AdminBranchRecord[],
  translateKnown: (value: BranchOption) => string
): string {
  const record = branches.find((branch) => branch.slug === slug);
  if (record) return record.name;
  if (isBranchOption(slug)) return translateKnown(slug);
  return slug;
}

function getDepartmentsForBranch(
  branch: AdminBranchRecord,
  employees: readonly AdminEmployee[]
): AdminBranchDepartmentSummary[] {
  const assignments = getBranchDepartmentsSnapshot().filter(
    (item) => item.branchId === branch.id
  );

  return assignments.map((assignment) => {
    const manager =
      getEmployeeManagerProfile(assignment.managerEmployeeId, employees) ?? {
        name: "—",
        email: "—",
        position: "—",
      };

    return {
      id: assignment.id,
      slug: assignment.slug,
      name: assignment.name,
      manager,
      memberCount: countDepartmentMembers(
        branch.slug,
        assignment.slug,
        employees
      ),
    };
  });
}

export function buildBranchOverviews(
  employees: readonly AdminEmployee[]
): AdminBranchOverview[] {
  return getBranchesSnapshot().map((branch) => {
    const branchEmployees = employees.filter(
      (employee) => employee.branch === branch.slug
    );

    return {
      branch: branch.slug,
      employeeCount: branchEmployees.length,
      departments: getDepartmentsForBranch(branch, employees),
    };
  });
}

export function getBranchOverview(
  branchSlug: string,
  employees: readonly AdminEmployee[]
): AdminBranchOverview | undefined {
  const branch = getBranchBySlug(branchSlug);
  if (!branch) return undefined;

  const branchEmployees = employees.filter(
    (employee) => employee.branch === branch.slug
  );

  return {
    branch: branch.slug,
    employeeCount: branchEmployees.length,
    departments: getDepartmentsForBranch(branch, employees),
  };
}

export function getBranchDepartmentOverview(
  branchSlug: string,
  departmentSlug: string,
  employees: readonly AdminEmployee[]
): AdminBranchDepartmentOverview | undefined {
  const branch = getBranchBySlug(branchSlug);
  if (!branch) return undefined;

  const assignment = getBranchDepartmentAssignment(branchSlug, departmentSlug);
  if (!assignment) return undefined;

  const manager =
    getEmployeeManagerProfile(assignment.managerEmployeeId, employees) ?? {
      name: "—",
      email: "—",
      position: "—",
    };

  return {
    branch: branch.slug,
    slug: assignment.slug,
    name: assignment.name,
    manager,
    members: employees.filter(
      (employee) =>
        employee.branch === branch.slug && employee.department === assignment.slug
    ),
  };
}
