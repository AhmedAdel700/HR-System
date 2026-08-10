import {
  BRANCH_OPTIONS,
  DEPARTMENT_OPTIONS,
  type BranchOption,
  type DepartmentOption,
} from "@/lib/auth/register-options";
import { getDepartmentManagerProfile } from "@/lib/admin/departmentManagers";
import type {
  AdminBranchDepartmentOverview,
  AdminBranchDepartmentSummary,
  AdminBranchOverview,
  AdminEmployee,
} from "@/types/AdminApiTypes";

export function isBranchOption(value: string): value is BranchOption {
  return (BRANCH_OPTIONS as readonly string[]).includes(value);
}

export function isDepartmentOption(value: string): value is DepartmentOption {
  return (DEPARTMENT_OPTIONS as readonly string[]).includes(value);
}

function getDepartmentsForBranch(
  branch: BranchOption,
  employees: readonly AdminEmployee[]
): AdminBranchDepartmentSummary[] {
  return DEPARTMENT_OPTIONS.filter((department) =>
    employees.some(
      (employee) =>
        employee.branch === branch && employee.department === department
    )
  ).map((department) => ({
    department,
    manager: getDepartmentManagerProfile(department),
    memberCount: employees.filter(
      (employee) =>
        employee.branch === branch && employee.department === department
    ).length,
  }));
}

export function buildBranchOverviews(
  employees: readonly AdminEmployee[]
): AdminBranchOverview[] {
  return BRANCH_OPTIONS.map((branch) => {
    const branchEmployees = employees.filter(
      (employee) => employee.branch === branch
    );

    return {
      branch,
      employeeCount: branchEmployees.length,
      departments: getDepartmentsForBranch(branch, employees),
    };
  });
}

export function getBranchOverview(
  branch: BranchOption,
  employees: readonly AdminEmployee[]
): AdminBranchOverview {
  const branchEmployees = employees.filter((employee) => employee.branch === branch);

  return {
    branch,
    employeeCount: branchEmployees.length,
    departments: getDepartmentsForBranch(branch, employees),
  };
}

export function getBranchDepartmentOverview(
  branch: BranchOption,
  department: DepartmentOption,
  employees: readonly AdminEmployee[]
): AdminBranchDepartmentOverview {
  return {
    branch,
    department,
    manager: getDepartmentManagerProfile(department),
    members: employees.filter(
      (employee) =>
        employee.branch === branch && employee.department === department
    ),
  };
}
