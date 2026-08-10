import type { AdminEmployee, AdminDepartmentManager } from "@/types/AdminApiTypes";

export function getEmployeeManagerProfile(
  employeeId: string,
  employees: readonly AdminEmployee[]
): AdminDepartmentManager | undefined {
  const employee = employees.find((item) => item.id === employeeId);
  if (!employee) return undefined;

  return {
    name: employee.name,
    email: employee.email,
    position: employee.position,
  };
}

export function countDepartmentMembers(
  branchSlug: string,
  departmentSlug: string,
  employees: readonly AdminEmployee[]
): number {
  return employees.filter(
    (employee) =>
      employee.branch === branchSlug && employee.department === departmentSlug
  ).length;
}
