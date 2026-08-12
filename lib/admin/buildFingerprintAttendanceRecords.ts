import { MOCK_ADMIN_EMPLOYEES } from "@/lib/admin/demo-data";
import type { AdminEmployee } from "@/types/AdminApiTypes";
import type {
  FingerprintAttendanceRecord,
  FingerprintAttendanceStatus,
} from "@/types/FingerprintImportApiTypes";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function resolveAttendanceStatus(
  clockIn: string | null,
  clockOut: string | null
): FingerprintAttendanceStatus {
  if (clockIn && clockOut) return "in_out";
  if (clockIn) return "in";
  if (clockOut) return "out";
  return "in";
}

export function buildFingerprintAttendanceRecord(
  employee: AdminEmployee,
  year: number,
  month: number,
  day: number,
  clockIn: string | null,
  clockOut: string | null,
  idSuffix = ""
): FingerprintAttendanceRecord {
  return {
    id: `fp-${employee.fingerprintNumber}-${year}${pad2(month)}${pad2(day)}${idSuffix}`,
    date: `${year}-${pad2(month)}-${pad2(day)}`,
    name: employee.name,
    phoneNumber: employee.phone,
    fingerprintId: employee.fingerprintNumber,
    fingerprintSerial: `SN-${employee.fingerprintNumber}`,
    clockIn,
    clockOut,
    attendanceStatus: resolveAttendanceStatus(clockIn, clockOut),
  };
}

export function isWeekday(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  const weekday = date.getDay();
  return weekday !== 5 && weekday !== 6;
}

export function buildDemoFingerprintRecords(
  year: number,
  month: number,
  employeeLimit = 4
): FingerprintAttendanceRecord[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const records: FingerprintAttendanceRecord[] = [];

  for (const employee of MOCK_ADMIN_EMPLOYEES.slice(0, employeeLimit)) {
    for (let day = 1; day <= daysInMonth; day += 1) {
      if (!isWeekday(year, month, day)) continue;

      const clockIn = `08:${pad2(30 + (day % 25))}`;
      const clockOut = day % 7 === 0 ? null : `17:${pad2(15 + (day % 10))}`;

      records.push(
        buildFingerprintAttendanceRecord(
          employee,
          year,
          month,
          day,
          clockIn,
          clockOut
        )
      );
    }
  }

  return records;
}
