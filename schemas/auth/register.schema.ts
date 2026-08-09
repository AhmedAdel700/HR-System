import { z } from "zod";

export type RegisterErrorMessages = {
  nameRequired: string;
  nameMin: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  passwordRequired: string;
  passwordMin: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
};

export function createRegisterSchema(errors: RegisterErrorMessages) {
  return z
    .object({
      name: z
        .string()
        .min(1, { error: errors.nameRequired })
        .min(2, { error: errors.nameMin }),
      email: z
        .string()
        .min(1, { error: errors.emailRequired })
        .pipe(z.email({ error: errors.emailInvalid })),
      phone: z
        .string()
        .min(1, { error: errors.phoneRequired })
        .regex(/^[0-9]{8,15}$/, { error: errors.phoneInvalid }),
      password: z
        .string()
        .min(1, { error: errors.passwordRequired })
        .min(8, { error: errors.passwordMin }),
      confirmPassword: z
        .string()
        .min(1, { error: errors.confirmPasswordRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      error: errors.passwordMismatch,
    });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
