"use client";

import { useSyncExternalStore } from "react";

const LARGE_SCREEN_QUERY = "(min-width: 1024px)";

function subscribe(onStoreChange: () => void): () => void {
  const media = window.matchMedia(LARGE_SCREEN_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(LARGE_SCREEN_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useLargeScreen(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
