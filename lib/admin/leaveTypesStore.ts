import { MOCK_LEAVE_TYPES } from "@/lib/admin/demo-leave-types";
import type { LeaveTypeRecord } from "@/types/LeaveTypesApiTypes";

export interface CreateLeaveTypeInput {
  name: string;
  unit: LeaveTypeRecord["unit"];
  category: string;
  defaultEntitlement: number;
}

let leaveTypes: LeaveTypeRecord[] = MOCK_LEAVE_TYPES.map((item) => ({ ...item }));
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeLeaveTypes(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLeaveTypesSnapshot(): LeaveTypeRecord[] {
  return leaveTypes;
}

export function slugifyLeaveTypeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildUniqueLeaveTypeSlug(
  name: string,
  existing: readonly LeaveTypeRecord[]
): string {
  const base = slugifyLeaveTypeName(name) || "leave-type";
  const existingSlugs = new Set(existing.map((item) => item.slug));

  if (!existingSlugs.has(base)) return base;

  let suffix = 2;
  while (existingSlugs.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}

export function createLeaveType(input: CreateLeaveTypeInput): LeaveTypeRecord {
  const slug = buildUniqueLeaveTypeSlug(input.name, leaveTypes);
  const next: LeaveTypeRecord = {
    id: `lt-${Date.now()}`,
    slug,
    name: input.name.trim(),
    unit: input.unit,
    category: input.category.trim(),
    defaultEntitlement: input.defaultEntitlement,
  };

  leaveTypes = [...leaveTypes, next];
  emit();
  return next;
}
