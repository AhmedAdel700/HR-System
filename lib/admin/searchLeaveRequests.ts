import type { BranchOption, DepartmentOption } from "@/lib/auth/register-options";
import type { DemoRequest, RequestType } from "@/lib/employee/demo-data";

export function searchLeaveRequests(
  requests: DemoRequest[],
  query: string,
  labels: {
    department: (value: DepartmentOption) => string;
    branch: (value: BranchOption) => string;
    type: (value: RequestType) => string;
  }
): DemoRequest[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return requests;
  }

  return requests.filter((request) => {
    const haystack = [
      request.employeeName,
      request.reason,
      labels.department(request.department),
      labels.branch(request.branch),
      labels.type(request.type),
      request.from,
      request.to,
      request.createdAt,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
