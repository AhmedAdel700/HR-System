import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MainButton } from "@/components/shared/MainButton";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="min-h-dvh bg-surface-sunken px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-sm text-text-secondary">{t("description")}</p>
        </header>

        <div className="flex flex-wrap gap-3">
          <MainButton variant="primary" link="/login">
            Login UI
          </MainButton>
          <MainButton variant="neutral" link="/register">
            Register UI
          </MainButton>
        </div>

        <p className="text-xs text-text-muted">
          Or open{" "}
          <Link href="/login" className="text-primary-600 hover:underline">
            /login
          </Link>{" "}
          and{" "}
          <Link href="/register" className="text-primary-600 hover:underline">
            /register
          </Link>{" "}
          directly.
        </p>
      </div>
    </main>
  );
}
