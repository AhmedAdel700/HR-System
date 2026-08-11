"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { MainButton } from "@/components/shared/MainButton";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
  /** `dark` for the brand panel, `light` for the form panel */
  tone?: "dark" | "light";
};

const localeMeta = {
  en: { short: "EN", name: "English" },
  ar: { short: "AR", name: "العربية" },
} as const;

export function LocaleSwitcher({
  className,
  tone = "light",
}: LocaleSwitcherProps) {
  const t = useTranslations("auth.language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = Math.max(
    0,
    routing.locales.findIndex((code) => code === locale)
  );

  const nextLocale = locale === "ar" ? "en" : "ar";
  const nextName = t.has(nextLocale)
    ? t(nextLocale)
    : localeMeta[nextLocale].name;

  const switchTo = (next: "en" | "ar") => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={cn(
        "relative inline-grid grid-cols-2 rounded-lg p-1",
        tone === "dark"
          ? "bg-white/[0.07] ring-1 ring-inset ring-white/10"
          : "bg-neutral-100 ring-1 ring-inset ring-border",
        className
      )}
      role="group"
      aria-label={
        t.has("switchTo")
          ? t("switchTo", { locale: nextName })
          : `Switch language to ${nextName}`
      }
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-1 start-1 w-[calc(50%-4px)] rounded-md",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          tone === "dark"
            ? "bg-primary-500 shadow-[0_1px_2px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.18)]"
            : "bg-surface shadow-sm ring-1 ring-border",
          activeIndex === 1 && "translate-x-full rtl:-translate-x-full"
        )}
      />

      {routing.locales.map((code) => {
        const active = code === locale;
        const meta = localeMeta[code as keyof typeof localeMeta];
        const name = t.has(code) ? t(code) : meta.name;

        return (
          <MainButton
            key={code}
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => switchTo(code)}
            aria-pressed={active}
            aria-label={name}
            className={cn(
              "relative z-10 h-7 min-w-[2.75rem] rounded-md px-3",
              "text-[11px] font-semibold tracking-[0.08em] shadow-none",
              "hover:bg-transparent active:translate-y-0",
              tone === "dark"
                ? active
                  ? "text-white"
                  : "text-neutral-400 hover:text-neutral-200"
                : active
                  ? "text-ink"
                  : "text-text-muted hover:text-text-secondary"
            )}
          >
            {meta.short}
          </MainButton>
        );
      })}
    </div>
  );
}
