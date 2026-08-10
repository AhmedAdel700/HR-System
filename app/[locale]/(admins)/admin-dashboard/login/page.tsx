import { Login } from "@/app/[locale]/(auth)/login/Login";

export default async function AdminLoginPage() {
  return <Login showRegisterLink={false} />;
}