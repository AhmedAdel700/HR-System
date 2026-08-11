import { DEMO_EMPLOYEE_PROFILE } from "@/lib/employee/demo-profile";
import type {
  EditableEmployeeProfileFields,
  EmployeeProfile,
} from "@/types/EmployeeProfileTypes";

let profile: EmployeeProfile = { ...DEMO_EMPLOYEE_PROFILE };
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeEmployeeProfile(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getEmployeeProfileSnapshot(): EmployeeProfile {
  return profile;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(String(reader.result));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

export async function updateEmployeeProfile(
  values: Omit<EditableEmployeeProfileFields, "avatarSrc"> & {
    avatarFile?: File;
  },
): Promise<EmployeeProfile> {
  let avatarSrc = profile.avatarSrc;

  if (values.avatarFile) {
    avatarSrc = await fileToDataUrl(values.avatarFile);
  }

  profile = {
    ...profile,
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    fingerprintNumber: values.fingerprintNumber.trim(),
    avatarSrc,
  };

  emit();
  return profile;
}
