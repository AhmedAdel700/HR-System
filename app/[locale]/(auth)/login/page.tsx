import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthSplitCard } from "@/components/auth/AuthSplitCard";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <AuthShell>
      <AuthSplitCard
        brand={t("brand")}
        title={t("login.title")}
        subtitle={t("login.subtitle")}
      >
        <LoginForm />
      </AuthSplitCard>
    </AuthShell>
  );
}
