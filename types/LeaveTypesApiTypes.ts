export type LeaveTypeUnit = "days" | "hours";

export interface LeaveTypeRecord {
  id: string;
  slug: string;
  name: string;
  unit: LeaveTypeUnit;
  category: string;
  defaultEntitlement: number;
}
