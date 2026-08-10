import {
  LEAVE_BALANCE,
  LEAVE_BALANCE_GROUPS,
  type LeaveBalanceKey,
} from "@/lib/employee/demo-data";
import type { LeaveTypeRecord } from "@/types/LeaveTypesApiTypes";

const LEAVE_TYPE_NAMES: Record<LeaveBalanceKey, string> = {
  annual: "Annual leave",
  sick: "Sick leave",
  unpaid: "Unpaid leave",
  remote: "Remote work",
  compassionate: "Compassionate leave",
  maternity: "Maternity leave",
  paternity: "Paternity leave",
  marriage: "Marriage leave",
  hajj: "Hajj leave",
  study: "Study leave",
  emergency: "Emergency leave",
  compensatory: "Compensatory leave",
  permission: "Short permission",
};

const LEAVE_TYPE_ENTITLEMENTS: Record<LeaveBalanceKey, number> = {
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

const LEAVE_TYPE_CATEGORY_LABELS: Record<
  (typeof LEAVE_BALANCE_GROUPS)[number]["id"],
  string
> = {
  core: "Time off",
  family: "Family",
  flexibility: "Work flexibility",
  special: "Special leave",
};

function resolveCategory(key: LeaveBalanceKey): string {
  const group = LEAVE_BALANCE_GROUPS.find((item) => item.keys.includes(key));
  if (!group) return LEAVE_TYPE_CATEGORY_LABELS.core;
  return LEAVE_TYPE_CATEGORY_LABELS[group.id];
}

export const MOCK_LEAVE_TYPES: LeaveTypeRecord[] = LEAVE_BALANCE.map(
  (item, index) => ({
    id: `lt-${index + 1}`,
    slug: item.key,
    name: LEAVE_TYPE_NAMES[item.key],
    unit: item.unit,
    category: resolveCategory(item.key),
    defaultEntitlement: LEAVE_TYPE_ENTITLEMENTS[item.key],
  })
);
