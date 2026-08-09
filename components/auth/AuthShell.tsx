import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AuthShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-8 sm:py-10",
        className
      )}
    >
      {/* Base wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, var(--color-neutral-50) 0%, var(--color-neutral-100) 48%, #ebe6e1 100%)",
        }}
      />

      {/* Soft brand light — top start */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] start-[-10%] size-[42rem] rounded-full opacity-[0.35]"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary-100) 0%, transparent 68%)",
        }}
      />

      {/* Cool ink wash — bottom end, balances the warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[25%] end-[-15%] size-[38rem] rounded-full opacity-[0.22]"
        style={{
          background:
            "radial-gradient(circle, var(--color-ink-200) 0%, transparent 70%)",
        }}
      />

      {/* Hairline grid — neutral with a soft brand tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in srgb, var(--color-neutral-300) 72%, var(--color-primary-300) 28%) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--color-neutral-300) 72%, var(--color-primary-300) 28%) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 45%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 45%, black 20%, transparent 75%)",
        }}
      />

      {/* Center spotlight so the card sits in clear focus */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 48%, rgb(255 255 255 / 0.72) 0%, transparent 70%)",
        }}
      />

      {/* Soft outer vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 45%, rgb(20 18 17 / 0.06) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl">{children}</div>
    </main>
  );
}
