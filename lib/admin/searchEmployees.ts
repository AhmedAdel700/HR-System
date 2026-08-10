import type { DepartmentOption } from "@/lib/auth/register-options";
import type { AdminEmployee } from "@/types/AdminApiTypes";

export function searchEmployees(
  employees: AdminEmployee[],
  query: string,
  labels: {
    department: (value: DepartmentOption) => string;
    departmentManager: (value: DepartmentOption) => string;
    status: (value: AdminEmployee["status"]) => string;
  }
): AdminEmployee[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return employees;
  }

  return employees.filter((employee) => {
    const haystack = [
      employee.name,
      employee.email,
      employee.phone,
      employee.position,
      labels.department(employee.department),
      labels.departmentManager(employee.department),
      labels.status(employee.status),
      employee.joinedAt,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
