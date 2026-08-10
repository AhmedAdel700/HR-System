import {
  DEMO_EMPLOYEE_ID,
  LEAVE_BALANCE,
  type LeaveBalanceKey,
  type LeaveBalanceUnit,
} from "@/lib/employee/demo-data";

export interface LeaveBalanceStat {
  key: LeaveBalanceKey;
  remaining: number;
  used: number;
  total: number;
  unit: LeaveBalanceUnit;
}

export interface LeaveStatsSummary {
  daysRemaining: number;
  hoursRemaining: number;
  typesCount: number;
}

/** Standard annual entitlements per leave type (demo; replace when API lands). */
const LEAVE_ENTITLEMENTS: Record<LeaveBalanceKey, number> = {
  annual: 30,
  sick: 14,
  unpaid: 30,
  remote: 12,
  compassionate: 5,
  maternity: 70,
  paternity: 3,
  marriage: 5,
  hajj: 15,
  study: 10,
  emergency: 3,
  compensatory: 5,
  permission: 16,
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getEmployeeLeaveBalance(employeeId: string): LeaveBalanceStat[] {
  if (employeeId === DEMO_EMPLOYEE_ID) {
    return LEAVE_BALANCE.map((item) => {
      const total = LEAVE_ENTITLEMENTS[item.key];
      return {
        key: item.key,
        remaining: item.remaining,
        used: Math.max(0, total - item.remaining),
        total,
        unit: item.unit,
      };
    });
  }

  return LEAVE_BALANCE.map((item) => {
    const total = LEAVE_ENTITLEMENTS[item.key];
    const hash = hashString(`${employeeId}:${item.key}`);
    const maxUsed = Math.max(1, Math.floor(total * 0.65));
    const used = hash % (maxUsed + 1);
    const remaining = Math.max(0, total - used);

    return {
      key: item.key,
      remaining,
      used,
      total,
      unit: item.unit,
    };
  });
}

export function summarizeLeaveStats(
  stats: readonly LeaveBalanceStat[]
): LeaveStatsSummary {
  let daysRemaining = 0;
  let hoursRemaining = 0;

  for (const item of stats) {
    if (item.unit === "days") {
      daysRemaining += item.remaining;
    } else {
      hoursRemaining += item.remaining;
    }
  }

  return {
    daysRemaining,
    hoursRemaining,
    typesCount: stats.length,
  };
}

export function getLeaveUsagePercent(stat: LeaveBalanceStat): number {
  if (stat.total <= 0) return 0;
  return Math.min(100, Math.round((stat.used / stat.total) * 100));
}
