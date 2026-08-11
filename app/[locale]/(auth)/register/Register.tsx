import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function Register() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
