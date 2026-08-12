import type { ReactNode } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LocaleSwitcher } from "@/components/auth/LocaleSwitcher";
import { cn } from "@/lib/utils";

type AuthSplitCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function AuthSplitCard({
  title,
  subtitle,
  children,
  className,
  imageSrc,
  imageAlt = "",
}: AuthSplitCardProps) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-md",
        "min-h-[32rem] lg:min-h-[36rem]",
        // Wider brand track on the inline-start side (left in LTR, right in RTL)
        "lg:grid-cols-[1.35fr_1fr]",
        className
      )}
    >
      {/* Brand column — first in DOM so it sits at inline-start under dir */}
      <div
        className={cn(
          "relative hidden overflow-hidden bg-ink lg:block",
          // Diagonal on the form-facing edge; mirrored for RTL
          "[clip-path:polygon(0_0,100%_0,78%_100%,0_100%)]",
          "rtl:[clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]"
        )}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        ) : null}

        <div
          className="absolute inset-0 bg-ink"
          style={
            imageSrc
              ? {
                  background:
                    "linear-gradient(160deg, rgb(20 18 17 / 0.65), rgb(20 18 17 / 0.4))",
                }
              : undefined
          }
        />

        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative z-10 flex h-full min-h-[36rem] flex-col justify-between p-10 text-text-inverse xl:p-12">
          <BrandLogo size="xl" variant="onDark" priority />

          <div className="space-y-3 pb-2">
            <p className="max-w-[16rem] text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
              {title}
            </p>
            <p className="max-w-[16rem] text-sm leading-relaxed text-neutral-400">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Form column — sits at inline-end (right in LTR, left in RTL) */}
      <div className="relative z-10 flex flex-col justify-center bg-surface px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
        <div className="absolute top-5 end-5 z-20 sm:top-6 sm:end-6 lg:top-8 lg:end-8 xl:end-10">
          <LocaleSwitcher tone="light" />
        </div>

        <div className="mx-auto w-full max-w-none">
          <div className="mb-7 lg:hidden">
            <div className="mb-4 pe-24">
              <BrandLogo size="lg" priority />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
          </div>

          <div className="mb-6 hidden lg:block">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
