import type { BranchOption, DepartmentOption } from "@/lib/auth/register-options";

/** Demo employee whose session the employee app represents (Sara Ahmed). */
export const DEMO_EMPLOYEE_ID = "emp-1";

export type LeaveBalanceKey =
  | "annual"
  | "sick"
  | "unpaid"
  | "remote"
  | "compassionate"
  | "maternity"
  | "paternity"
  | "marriage"
  | "hajj"
  | "study"
  | "emergency"
  | "compensatory"
  | "permission";

export type LeaveBalanceUnit = "days" | "hours";

export interface LeaveBalanceItem {
  key: LeaveBalanceKey;
  remaining: number;
  unit: LeaveBalanceUnit;
}

/** Remaining leave entitlements for the demo employee (replace when API lands). */
export const LEAVE_BALANCE: LeaveBalanceItem[] = [
  { key: "annual", remaining: 18, unit: "days" },
  { key: "sick", remaining: 7, unit: "days" },
  { key: "unpaid", remaining: 10, unit: "days" },
  { key: "remote", remaining: 4, unit: "days" },
  { key: "compassionate", remaining: 3, unit: "days" },
  { key: "maternity", remaining: 70, unit: "days" },
  { key: "paternity", remaining: 3, unit: "days" },
  { key: "marriage", remaining: 5, unit: "days" },
  { key: "hajj", remaining: 10, unit: "days" },
  { key: "study", remaining: 5, unit: "days" },
  { key: "emergency", remaining: 2, unit: "days" },
  { key: "compensatory", remaining: 2, unit: "days" },
  { key: "permission", remaining: 8, unit: "hours" },
];

export const LEAVE_BALANCE_GROUPS: {
  id: "core" | "family" | "flexibility" | "special";
  keys: LeaveBalanceKey[];
}[] = [
  {
    id: "core",
    keys: ["annual", "sick", "unpaid", "emergency", "compensatory"],
  },
  {
    id: "family",
    keys: ["maternity", "paternity", "marriage", "compassionate"],
  },
  {
    id: "flexibility",
    keys: ["remote", "permission"],
  },
  {
    id: "special",
    keys: ["hajj", "study"],
  },
];

export const demoEmployee = {
  avatarSrc: "/avatars/sara.png",
  initials: "SA",
  fingerprintNumber: "100001",
  leaveBalance: LEAVE_BALANCE,
} as const;

export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "halfday"
  | "holiday";

export type RequestStatus = "pending" | "approved" | "rejected";

export type RequestType =
  | "annual"
  | "sick"
  | "unpaid"
  | "remote"
  | "compassionate"
  | "maternity"
  | "paternity"
  | "marriage"
  | "hajj"
  | "study"
  | "emergency"
  | "compensatory"
  | "permission";

export const REQUEST_TYPES: RequestType[] = [
  "annual",
  "sick",
  "unpaid",
  "remote",
  "compassionate",
  "maternity",
  "paternity",
  "marriage",
  "hajj",
  "study",
  "emergency",
  "compensatory",
  "permission",
];

export type DemoAttendanceDay = {
  id: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
};

export type DemoRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  department: DepartmentOption;
  branch: BranchOption;
  type: RequestType;
  status: RequestStatus;
  from: string;
  to: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  note?: string;
  createdAt: string;
};

export const demoAttendanceWeek: DemoAttendanceDay[] = [
  {
    id: "a1",
    date: "2026-08-03",
    status: "present",
    checkIn: "08:58",
    checkOut: "17:05",
  },
  {
    id: "a2",
    date: "2026-08-04",
    status: "late",
    checkIn: "09:22",
    checkOut: "17:10",
  },
  {
    id: "a3",
    date: "2026-08-05",
    status: "present",
    checkIn: "08:55",
    checkOut: "17:01",
  },
  {
    id: "a4",
    date: "2026-08-06",
    status: "halfday",
    checkIn: "09:00",
    checkOut: "13:00",
  },
  {
    id: "a5",
    date: "2026-08-07",
    status: "holiday",
  },
];

export const demoRequests: DemoRequest[] = [
  {
    id: "r1",
    employeeId: "emp-1",
    employeeName: "Sara Ahmed",
    department: "hr",
    branch: "riyadh",
    type: "annual",
    status: "pending",
    from: "2026-08-18",
    to: "2026-08-22",
    reason: "Family trip planned earlier this year.",
    note: "Will hand over tasks to the team lead.",
    createdAt: "2026-08-08",
  },
  {
    id: "r2",
    employeeId: "emp-1",
    employeeName: "Sara Ahmed",
    department: "hr",
    branch: "riyadh",
    type: "sick",
    status: "approved",
    from: "2026-07-14",
    to: "2026-07-15",
    reason: "Flu and doctor appointment.",
    createdAt: "2026-07-13",
  },
  {
    id: "r3",
    employeeId: "emp-1",
    employeeName: "Sara Ahmed",
    department: "hr",
    branch: "riyadh",
    type: "remote",
    status: "approved",
    from: "2026-07-28",
    to: "2026-07-28",
    reason: "Home internet maintenance window.",
    createdAt: "2026-07-26",
  },
  {
    id: "r4",
    employeeId: "emp-1",
    employeeName: "Sara Ahmed",
    department: "hr",
    branch: "riyadh",
    type: "permission",
    status: "pending",
    from: "2026-08-12",
    to: "2026-08-12",
    startTime: "11:00",
    endTime: "13:00",
    reason: "Government paperwork appointment.",
    createdAt: "2026-08-09",
  },
  {
    id: "r5",
    employeeId: "emp-2",
    employeeName: "Mohamed Ali",
    department: "operations",
    branch: "jeddah",
    type: "annual",
    status: "pending",
    from: "2026-08-25",
    to: "2026-08-27",
    reason: "Personal travel.",
    createdAt: "2026-08-10",
  },
  {
    id: "r6",
    employeeId: "emp-3",
    employeeName: "Nour Ibrahim",
    department: "finance",
    branch: "riyadh",
    type: "sick",
    status: "pending",
    from: "2026-08-11",
    to: "2026-08-12",
    reason: "Medical follow-up.",
    createdAt: "2026-08-10",
  },
  {
    id: "r7",
    employeeId: "emp-6",
    employeeName: "Khaled Farouk",
    department: "hr",
    branch: "riyadh",
    type: "remote",
    status: "pending",
    from: "2026-08-14",
    to: "2026-08-14",
    reason: "Home maintenance scheduled.",
    createdAt: "2026-08-09",
  },
];

export function getDemoRequest(id: string) {
  return demoRequests.find((item) => item.id === id);
}

export function isRequestType(value: string): value is RequestType {
  return REQUEST_TYPES.includes(value as RequestType);
}

export const leaveTypeSurface: Record<
  RequestType,
  { soft: string; solid: string; strong: string }
> = {
  annual: {
    soft: "bg-leave-annual-50 text-leave-annual-700",
    solid: "bg-leave-annual-500 text-text-inverse",
    strong: "text-leave-annual-700",
  },
  sick: {
    soft: "bg-leave-sick-50 text-leave-sick-700",
    solid: "bg-leave-sick-500 text-text-inverse",
    strong: "text-leave-sick-700",
  },
  unpaid: {
    soft: "bg-leave-unpaid-50 text-leave-unpaid-700",
    solid: "bg-leave-unpaid-500 text-text-inverse",
    strong: "text-leave-unpaid-700",
  },
  remote: {
    soft: "bg-leave-remote-50 text-leave-remote-700",
    solid: "bg-leave-remote-500 text-text-inverse",
    strong: "text-leave-remote-700",
  },
  compassionate: {
    soft: "bg-leave-compassionate-50 text-leave-compassionate-700",
    solid: "bg-leave-compassionate-500 text-text-inverse",
    strong: "text-leave-compassionate-700",
  },
  maternity: {
    soft: "bg-leave-maternity-50 text-leave-maternity-700",
    solid: "bg-leave-maternity-500 text-text-inverse",
    strong: "text-leave-maternity-700",
  },
  paternity: {
    soft: "bg-leave-paternity-50 text-leave-paternity-700",
    solid: "bg-leave-paternity-500 text-text-inverse",
    strong: "text-leave-paternity-700",
  },
  marriage: {
    soft: "bg-leave-marriage-50 text-leave-marriage-700",
    solid: "bg-leave-marriage-500 text-text-inverse",
    strong: "text-leave-marriage-700",
  },
  hajj: {
    soft: "bg-leave-hajj-50 text-leave-hajj-700",
    solid: "bg-leave-hajj-500 text-text-inverse",
    strong: "text-leave-hajj-700",
  },
  study: {
    soft: "bg-leave-study-50 text-leave-study-700",
    solid: "bg-leave-study-500 text-text-inverse",
    strong: "text-leave-study-700",
  },
  emergency: {
    soft: "bg-leave-emergency-50 text-leave-emergency-700",
    solid: "bg-leave-emergency-500 text-text-inverse",
    strong: "text-leave-emergency-700",
  },
  compensatory: {
    soft: "bg-leave-compensatory-50 text-leave-compensatory-700",
    solid: "bg-leave-compensatory-500 text-text-inverse",
    strong: "text-leave-compensatory-700",
  },
  permission: {
    soft: "bg-leave-permission-50 text-leave-permission-700",
    solid: "bg-leave-permission-500 text-text-inverse",
    strong: "text-leave-permission-700",
  },
};

export const leaveBalanceDot: Record<LeaveBalanceKey, string> = {
  annual: "bg-leave-annual-500",
  sick: "bg-leave-sick-500",
  unpaid: "bg-leave-unpaid-500",
  remote: "bg-leave-remote-500",
  compassionate: "bg-leave-compassionate-500",
  maternity: "bg-leave-maternity-500",
  paternity: "bg-leave-paternity-500",
  marriage: "bg-leave-marriage-500",
  hajj: "bg-leave-hajj-500",
  study: "bg-leave-study-500",
  emergency: "bg-leave-emergency-500",
  compensatory: "bg-leave-compensatory-500",
  permission: "bg-leave-permission-500",
};

export const attendanceStatusSurface: Record<
  AttendanceStatus,
  string
> = {
  present: "bg-attendance-present-50 text-attendance-present-700",
  late: "bg-attendance-late-50 text-attendance-late-700",
  absent: "bg-attendance-absent-50 text-attendance-absent-700",
  halfday: "bg-attendance-halfday-50 text-attendance-halfday-700",
  holiday: "bg-attendance-holiday-50 text-attendance-holiday-700",
};
