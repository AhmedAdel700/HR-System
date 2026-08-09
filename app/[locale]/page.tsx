import { getTranslations } from "next-intl/server";
import { MainButton } from "@/components/shared/MainButton";

const variants = [
  "primary",
  "cta",
  "add",
  "delete",
  "warning",
  "edit",
  "add-soft",
  "delete-soft",
  "warning-soft",
  "ghost",
  "ghost-brand",
  "ghost-delete",
  "neutral",
  "link",
] as const;

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="min-h-full bg-surface-sunken px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-ink">{t("title")}</h1>
          <p className="text-text-secondary">{t("description")}</p>
        </header>

        <section className="space-y-4 rounded-xl bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Variants
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {variants.map((variant) => (
              <MainButton key={variant} variant={variant}>
                {variant}
              </MainButton>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-xl bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <MainButton size="sm">Small</MainButton>
            <MainButton size="md">Medium</MainButton>
            <MainButton size="lg">Large</MainButton>
            <MainButton size="xl">Extra large</MainButton>
          </div>
        </section>

        <section className="space-y-4 rounded-xl bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            States
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <MainButton loading>Loading</MainButton>
            <MainButton disabled>Disabled</MainButton>
            <MainButton block>Full width</MainButton>
          </div>
        </section>
      </div>
    </main>
  );
}
