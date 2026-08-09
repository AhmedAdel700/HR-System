import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main>
      <h1 className="text-3xl font-bold text-primary-500">{t("title")}</h1>
      <p className="mt-2 text-neutral-600">{t("description")}</p>
    </main>
  );
}
