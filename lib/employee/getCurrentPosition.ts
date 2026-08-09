import type { AttendancePunchErrorCode } from "@/types/AttendanceApiTypes";

export interface CurrentPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export class LocationError extends Error {
  readonly code: AttendancePunchErrorCode;

  constructor(code: AttendancePunchErrorCode, message: string) {
    super(message);
    this.name = "LocationError";
    this.code = code;
  }
}

export function getCurrentPosition(): Promise<CurrentPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(
        new LocationError(
          "LOCATION_UNAVAILABLE",
          "Geolocation is not supported in this environment."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toISOString(),
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new LocationError(
              "LOCATION_DENIED",
              "Location permission was denied."
            )
          );
          return;
        }

        reject(
          new LocationError(
            "LOCATION_UNAVAILABLE",
            "Unable to determine current location."
          )
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 0,
      }
    );
  });
}
