import { z } from "zod";

export type AuthErrorMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
};

export function createLoginSchema(errors: AuthErrorMessages) {
  return z.object({
    email: z
      .string()
      .min(1, { error: errors.emailRequired })
      .pipe(z.email({ error: errors.emailInvalid })),
    password: z
      .string()
      .min(1, { error: errors.passwordRequired })
      .min(8, { error: errors.passwordMin }),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
