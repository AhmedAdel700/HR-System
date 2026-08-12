import type { FingerprintAttendanceRecord } from "@/types/FingerprintImportApiTypes";

export function searchFingerprintRecords(
  records: readonly FingerprintAttendanceRecord[],
  query: string
): FingerprintAttendanceRecord[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...records];
  }

  return records.filter((record) => {
    const haystack = [
      record.date,
      record.name ?? "",
      record.phoneNumber ?? "",
      record.fingerprintId,
      record.fingerprintSerial ?? "",
      record.clockIn ?? "",
      record.clockOut ?? "",
      record.attendanceStatus,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
