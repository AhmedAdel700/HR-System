import type { BranchOption, DepartmentOption } from "@/lib/auth/register-options";
import type { RegistrationRequest } from "@/types/AdminApiTypes";

export function searchRegistrationRequests(
  requests: RegistrationRequest[],
  query: string,
  labels: {
    department: (value: DepartmentOption) => string;
    branch: (value: BranchOption) => string;
  }
): RegistrationRequest[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return requests;
  }

  return requests.filter((request) => {
    const haystack = [
      request.name,
      request.email,
      request.phone,
      request.fingerprintNumber,
      request.position,
      labels.department(request.department),
      labels.branch(request.branch),
      request.submittedAt,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
