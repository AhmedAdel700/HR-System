"use client";

import type { ReactElement, ReactNode } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/auth/LocaleSwitcher";
import { cn } from "@/lib/utils";

export type RegisterStepId = "profile" | "work" | "security";

interface RegisterStep {
  id: RegisterStepId;
  label: string;
  description: string;
}

interface RegisterWizardShellProps {
  brand: string;
  title: string;
  subtitle: string;
  steps: RegisterStep[];
  currentStep: RegisterStepId;
  children: ReactNode;
  footer: ReactNode;
}

export function RegisterWizardShell({
  brand,
  title,
  subtitle,
  steps,
  currentStep,
  children,
  footer,
}: RegisterWizardShellProps): ReactElement {
  const t = useTranslations("auth.register");
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const activeStep = steps[currentIndex];

  return (
    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface shadow-md lg:min-h-[38rem] lg:grid-cols-[17rem_1fr]">
      <aside className="relative hidden flex-col bg-ink px-6 py-8 text-text-inverse lg:flex xl:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 start-[-20%] size-56 rounded-full bg-primary-500/30 blur-3xl"
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary-500 text-xs font-semibold shadow-primary-sm">
            HR
          </span>
          <span className="text-sm font-medium text-neutral-300">{brand}</span>
        </div>

        <div className="relative z-10 mt-10 space-y-1">
          <p className="text-xl font-semibold leading-snug text-white">{title}</p>
          <p className="text-sm leading-relaxed text-neutral-400">{subtitle}</p>
        </div>

        <ol className="relative z-10 mt-10 space-y-2">
          {steps.map((step, index) => {
            const done = index < currentIndex;
            const active = step.id === currentStep;

            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                  active && "bg-white/10",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                    done && "bg-primary-500 text-text-inverse",
                    active && !done && "bg-white text-ink",
                    !done && !active && "bg-white/10 text-neutral-400",
                  )}
                >
                  {done ? <Check className="size-3.5" strokeWidth={2.5} /> : index + 1}
                </span>
                <span className="min-w-0 pt-0.5">
                  <span
                    className={cn(
                      "block text-sm font-medium",
                      active || done ? "text-white" : "text-neutral-500",
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-neutral-500">
                    {step.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="flex min-h-0 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
          <div className="inline-flex items-center gap-2.5 lg:hidden">
            <span className="grid size-8 place-items-center rounded-lg bg-primary-500 text-[10px] font-semibold text-text-inverse shadow-primary-sm">
              HR
            </span>
            <span className="text-sm font-semibold text-ink">{brand}</span>
          </div>
          <LocaleSwitcher tone="light" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-5 py-5 sm:px-7 sm:py-6">
          <div className="mb-5 lg:hidden">
            <div className="mb-3 flex gap-2">
              {steps.map((step, index) => {
                const done = index < currentIndex;
                const active = step.id === currentStep;

                return (
                  <span
                    key={step.id}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      done || active ? "bg-primary-500" : "bg-neutral-200",
                    )}
                  />
                );
              })}
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
              {t("stepCounter", { current: currentIndex + 1, total: steps.length })}
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              {activeStep?.label}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {activeStep?.description}
            </p>
          </div>

          <div className="hidden lg:block">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
              {t("stepCounter", { current: currentIndex + 1, total: steps.length })}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              {activeStep?.label}
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              {activeStep?.description}
            </p>
          </div>

          <div className="mt-5 min-h-0 flex-1">{children}</div>

          <div className="mt-6 shrink-0 space-y-4">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
