"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "behr-admin-sidebar-expanded";

function readExpanded(): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return true;
  return raw === "true";
}

function writeExpanded(expanded: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(expanded));
}

let expanded = true;
let preferenceReady = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return expanded;
}

function getServerSnapshot(): boolean {
  return true;
}

function getReadySnapshot(): boolean {
  return preferenceReady;
}

function getReadyServerSnapshot(): boolean {
  return false;
}

export function markSidebarPreferenceReady(): void {
  if (preferenceReady || typeof window === "undefined") return;
  expanded = readExpanded();
  preferenceReady = true;
  emit();
}

export function hydrateSidebarPreference(): boolean {
  markSidebarPreferenceReady();
  return expanded;
}

export function useSidebarPreferenceReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    getReadySnapshot,
    getReadyServerSnapshot
  );
}

export function setSidebarExpanded(next: boolean): void {
  expanded = next;
  writeExpanded(next);
  emit();
}

export function toggleSidebarExpanded(): void {
  setSidebarExpanded(!expanded);
}

export function useAdminSidebarExpanded(): {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  toggleExpanded: () => void;
  preferenceReady: boolean;
} {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const preferenceReady = useSidebarPreferenceReady();

  const setExpanded = useCallback((next: boolean) => {
    setSidebarExpanded(next);
  }, []);

  const toggleExpanded = useCallback(() => {
    toggleSidebarExpanded();
  }, []);

  return { expanded: value, setExpanded, toggleExpanded, preferenceReady };
}
