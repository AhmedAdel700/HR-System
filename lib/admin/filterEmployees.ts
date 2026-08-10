import type { BranchOption, DepartmentOption } from "@/lib/auth/register-options";
import type { AdminEmployee } from "@/types/AdminApiTypes";

export interface EmployeeListFilters {
  department: DepartmentOption | "all";
  branch: BranchOption | "all";
}

export function filterEmployeesByBranchAndDepartment(
  employees: AdminEmployee[],
  filters: EmployeeListFilters
): AdminEmployee[] {
  return employees.filter((employee) => {
    if (filters.department !== "all" && employee.department !== filters.department) {
      return false;
    }
    if (filters.branch !== "all" && employee.branch !== filters.branch) {
      return false;
    }
    return true;
  });
}
