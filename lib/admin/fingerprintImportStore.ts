"use client";

import { MOCK_FINGERPRINT_IMPORT_MONTHS } from "@/lib/admin/demo-fingerprint-imports";
import type {
  FingerprintImportMonthData,
  FingerprintImportMonthKey,
} from "@/types/FingerprintImportApiTypes";

const STORAGE_KEY = "behr-fingerprint-imports-v2";

const listeners = new Set<() => void>();

let monthDataMap = new Map<FingerprintImportMonthKey, FingerprintImportMonthData>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function toMonthKey(year: number, month: number): FingerprintImportMonthKey {
  return `${year}-${month}`;
}

function emptyMonthData(year: number, month: number): FingerprintImportMonthData {
  return { year, month, uploads: [], records: [] };
}

function readStoredMonths(): FingerprintImportMonthData[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFingerprintImportMonthData);
  } catch {
    return [];
  }
}

function isFingerprintImportMonthData(value: unknown): value is FingerprintImportMonthData {
  if (typeof value !== "object" || value === null) return false;
  if (!("year" in value) || !("month" in value)) return false;
  if (!("uploads" in value) || !("records" in value)) return false;
  return (
    typeof value.year === "number" &&
    typeof value.month === "number" &&
    Array.isArray(value.uploads) &&
    Array.isArray(value.records)
  );
}

function writeStoredMonths(months: readonly FingerprintImportMonthData[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(months));
}

function rebuildMapFromArray(months: readonly FingerprintImportMonthData[]): void {
  monthDataMap = new Map(
    months.map((item) => [toMonthKey(item.year, item.month), item])
  );
}

function persistMap(): void {
  writeStoredMonths(Array.from(monthDataMap.values()));
}

export function subscribeFingerprintImports(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function hydrateFingerprintImports(): void {
  const stored = readStoredMonths();
  const seed = stored.length > 0 ? stored : MOCK_FINGERPRINT_IMPORT_MONTHS;
  rebuildMapFromArray(seed);
  if (stored.length === 0) {
    persistMap();
  }
}

export function getFingerprintImportMonthSnapshot(
  year: number,
  month: number
): FingerprintImportMonthData {
  return monthDataMap.get(toMonthKey(year, month)) ?? emptyMonthData(year, month);
}

export function getAllFingerprintImportMonthsSnapshot(): FingerprintImportMonthData[] {
  return Array.from(monthDataMap.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

export function upsertFingerprintImportMonth(data: FingerprintImportMonthData): void {
  monthDataMap.set(toMonthKey(data.year, data.month), data);
  persistMap();
  emit();
}

export function getFingerprintImportsVersionSnapshot(): number {
  return monthDataMap.size;
}
