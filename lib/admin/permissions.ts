import type {
  AdminEmployee,
  AdminRole,
  AdminUser,
  RegistrationRequest,
} from "@/types/AdminApiTypes";
import type { DemoRequest } from "@/lib/employee/demo-data";

export function isSuperAdmin(role: AdminRole): boolean {
  return role === "super_admin";
}

export function canManageEmployees(role: AdminRole): boolean {
  return isSuperAdmin(role);
}

export function canViewEmployee(
  admin: AdminUser,
  employee: AdminEmployee
): boolean {
  if (isSuperAdmin(admin.role)) return true;
  return admin.department === employee.department;
}

export function canViewRegistration(
  admin: AdminUser,
  request: RegistrationRequest
): boolean {
  if (isSuperAdmin(admin.role)) return true;
  return admin.department === request.department;
}

export function filterEmployeesForAdmin(
  admin: AdminUser,
  employees: readonly AdminEmployee[]
): AdminEmployee[] {
  if (isSuperAdmin(admin.role)) return [...employees];
  if (!admin.department) return [];
  return employees.filter((e) => e.department === admin.department);
}

export function filterRegistrationsForAdmin(
  admin: AdminUser,
  requests: readonly RegistrationRequest[]
): RegistrationRequest[] {
  if (isSuperAdmin(admin.role)) return [...requests];
  if (!admin.department) return [];
  return requests.filter((r) => r.department === admin.department);
}

export function canViewLeaveRequest(
  admin: AdminUser,
  request: DemoRequest
): boolean {
  if (isSuperAdmin(admin.role)) return true;
  return admin.department === request.department;
}

export function filterLeaveRequestsForAdmin(
  admin: AdminUser,
  requests: readonly DemoRequest[]
): DemoRequest[] {
  if (isSuperAdmin(admin.role)) return [...requests];
  if (!admin.department) return [];
  return requests.filter((request) => request.department === admin.department);
}
