import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthSplitCard } from "@/components/auth/AuthSplitCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export async function Register() {
  const t = await getTranslations("auth");

  return (
    <AuthShell>
      <AuthSplitCard
        brand={t("brand")}
        title={t("register.title")}
        subtitle={t("register.subtitle")}
      >
        <RegisterForm />
      </AuthSplitCard>
    </AuthShell>
  );
}
