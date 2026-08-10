import type { DepartmentOption } from "@/lib/auth/register-options";
import type { AdminDepartmentManager } from "@/types/AdminApiTypes";

export const DEPARTMENT_MANAGER_PROFILES: Record<
  DepartmentOption,
  AdminDepartmentManager
> = {
  hr: { name: "Omar Khalil", email: "manager@behr.com", position: "Manager" },
  operations: {
    name: "Faisal Al-Rashid",
    email: "faisal.r@behr.com",
    position: "Senior Manager",
  },
  finance: { name: "Mona El-Sayed", email: "mona.s@behr.com", position: "Manager" },
  it: { name: "Karim Nabil", email: "karim.n@behr.com", position: "Senior Manager" },
  sales: { name: "Rania Farid", email: "rania.f@behr.com", position: "Manager" },
};

export function getDepartmentManagerProfile(
  department: DepartmentOption
): AdminDepartmentManager {
  return DEPARTMENT_MANAGER_PROFILES[department];
}

export function getDepartmentManagerName(
  department: DepartmentOption
): string {
  return DEPARTMENT_MANAGER_PROFILES[department].name;
}
