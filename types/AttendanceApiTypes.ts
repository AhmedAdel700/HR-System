export type AttendanceAction = "check-in" | "check-out";

export interface AttendanceLocationPayload {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface AttendancePunchRequest {
  action: AttendanceAction;
  workplaceId: string;
  location: AttendanceLocationPayload;
}

export type AttendancePunchErrorCode =
  | "OUTSIDE_GEOFENCE"
  | "LOCATION_DENIED"
  | "LOCATION_UNAVAILABLE";

export type AttendancePunchResponse =
  | {
      ok: true;
      recordedAt: string;
    }
  | {
      ok: false;
      code: AttendancePunchErrorCode;
      message: string;
    };
