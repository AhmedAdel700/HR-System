import type { AdminBranchRecord } from "@/types/AdminApiTypes";

export interface BranchSearchRow {
  branch: AdminBranchRecord;
  departmentCount: number;
  employeeCount: number;
}

export function searchBranchRows(
  rows: BranchSearchRow[],
  query: string
): BranchSearchRow[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return rows;
  }

  return rows.filter(({ branch, departmentCount, employeeCount }) => {
    const haystack = [
      branch.name,
      branch.slug,
      branch.city,
      branch.address,
      branch.phone,
      branch.email,
      String(departmentCount),
      String(employeeCount),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
