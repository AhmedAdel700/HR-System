"use client";

import {
  DEMO_DEPARTMENT_MANAGER,
  DEMO_SUPER_ADMIN,
} from "@/lib/admin/demo-data";
import type { AdminUser } from "@/types/AdminApiTypes";

const STORAGE_KEY = "behr-admin-session";

let adminUser: AdminUser = DEMO_SUPER_ADMIN;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function readStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in parsed &&
      "role" in parsed
    ) {
      return parsed as AdminUser;
    }
  } catch {
    return null;
  }
  return null;
}

function writeStoredUser(user: AdminUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function subscribeAdminSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAdminSessionSnapshot(): AdminUser {
  return adminUser;
}

export function hydrateAdminSession(): AdminUser {
  const stored = readStoredUser();
  if (stored) {
    adminUser = stored;
  }
  return adminUser;
}

export function setAdminSession(user: AdminUser): void {
  adminUser = user;
  writeStoredUser(user);
  emit();
}

export function clearAdminSession(): void {
  adminUser = DEMO_SUPER_ADMIN;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  emit();
}

export function switchDemoRole(role: "super_admin" | "department_manager"): void {
  setAdminSession(
    role === "super_admin" ? DEMO_SUPER_ADMIN : DEMO_DEPARTMENT_MANAGER
  );
}
