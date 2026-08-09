import type {
  AttendancePunchRequest,
  AttendancePunchResponse,
} from "@/types/AttendanceApiTypes";
import { distanceMeters, WORKPLACE } from "@/lib/employee/workplace";

const STUB_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Stub attendance punch submit.
 * Simulates backend geofence validation; swap body for a real `fetch` later.
 */
export async function submitAttendancePunch(
  request: AttendancePunchRequest
): Promise<AttendancePunchResponse> {
  await delay(STUB_DELAY_MS);

  if (request.workplaceId !== WORKPLACE.id) {
    return {
      ok: false,
      code: "OUTSIDE_GEOFENCE",
      message: "Workplace is not recognized for this punch.",
    };
  }

  const distance = distanceMeters(
    {
      latitude: request.location.latitude,
      longitude: request.location.longitude,
    },
    {
      latitude: WORKPLACE.latitude,
      longitude: WORKPLACE.longitude,
    }
  );

  if (distance > WORKPLACE.allowedRadius) {
    return {
      ok: false,
      code: "OUTSIDE_GEOFENCE",
      message: "You are outside the company location geofence.",
    };
  }

  return {
    ok: true,
    recordedAt: new Date().toISOString(),
  };
}
