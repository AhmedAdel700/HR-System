"use client";

import dynamic from "next/dynamic";
import { type ReactElement } from "react";
import type { MapLocationPickerProps } from "@/components/shared/MapLocationPicker";

const MapLocationPickerClient = dynamic(
  () =>
    import("@/components/shared/MapLocationPicker").then(
      (mod) => mod.MapLocationPicker,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 w-full animate-pulse rounded-xl border border-border bg-surface-muted/40 sm:h-64" />
    ),
  },
);

export function BranchMapPicker(props: MapLocationPickerProps): ReactElement {
  return <MapLocationPickerClient {...props} />;
}
