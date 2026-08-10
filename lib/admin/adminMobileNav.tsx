"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

interface AdminMobileNavContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AdminMobileNavContext = createContext<AdminMobileNavContextValue | null>(
  null
);

const MOBILE_DRAWER_MEDIA_QUERY = "(max-width: 1023px)";

export function AdminMobileNavProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <AdminMobileNavContext.Provider value={value}>
      {children}
    </AdminMobileNavContext.Provider>
  );
}

export function useAdminMobileDrawerMount(
  setOpen: (open: boolean) => void
): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_DRAWER_MEDIA_QUERY);

    const sync = (): void => {
      const isMobile = media.matches;
      setMounted(isMobile);
      if (!isMobile) {
        setOpen(false);
      }
    };

    setOpen(false);
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [setOpen]);

  return mounted;
}

export function useAdminMobileNav(): AdminMobileNavContextValue {
  const context = useContext(AdminMobileNavContext);
  if (!context) {
    throw new Error("useAdminMobileNav must be used within AdminMobileNavProvider");
  }
  return context;
}
