import type { BranchOption, DepartmentOption } from "@/lib/auth/register-options";
import type { DemoRequest } from "@/lib/employee/demo-data";

export interface LeaveRequestListFilters {
  department: DepartmentOption | "all";
  branch: BranchOption | "all";
}

export function filterLeaveRequestsByBranchAndDepartment(
  requests: DemoRequest[],
  filters: LeaveRequestListFilters
): DemoRequest[] {
  return requests.filter((request) => {
    if (
      filters.department !== "all" &&
      request.department !== filters.department
    ) {
      return false;
    }
    if (filters.branch !== "all" && request.branch !== filters.branch) {
      return false;
    }
    return true;
  });
}
