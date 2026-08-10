import type { AdminBranchDepartmentRecord } from "@/types/AdminApiTypes";

export function searchBranchDepartments(
  departments: AdminBranchDepartmentRecord[],
  query: string,
  labels: {
    branchName: (branchId: string) => string;
    managerName: (managerEmployeeId: string) => string;
  }
): AdminBranchDepartmentRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return departments;
  }

  return departments.filter((department) => {
    const haystack = [
      department.name,
      department.slug,
      labels.branchName(department.branchId),
      labels.managerName(department.managerEmployeeId),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
