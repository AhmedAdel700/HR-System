import type { AdminBranchDepartmentSummary } from "@/types/AdminApiTypes";

export function searchDepartmentSummaries(
  departments: AdminBranchDepartmentSummary[],
  query: string
): AdminBranchDepartmentSummary[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return departments;
  }

  return departments.filter((department) => {
    const haystack = [
      department.name,
      department.slug,
      department.manager.name,
      department.manager.email,
      department.manager.position,
      String(department.memberCount),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
