export const BRANCH_OPTIONS = [
  "riyadh",
  "jeddah",
  "dammam",
  "khobar",
] as const;

export const DEPARTMENT_OPTIONS = [
  "hr",
  "operations",
  "finance",
  "it",
  "sales",
] as const;

export type BranchOption = (typeof BRANCH_OPTIONS)[number];
export type DepartmentOption = (typeof DEPARTMENT_OPTIONS)[number];
