import { z } from "zod";

export type RegisterErrorMessages = {
  nameRequired: string;
  nameMin: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  fingerprintRequired: string;
  fingerprintInvalid: string;
  branchRequired: string;
  departmentRequired: string;
  positionRequired: string;
  positionMin: string;
  passwordRequired: string;
  passwordMin: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
  avatarInvalidType: string;
  avatarTooLarge: string;
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
      fingerprintNumber: z
        .string()
        .min(1, { error: errors.fingerprintRequired })
        .regex(/^[0-9]{1,20}$/, { error: errors.fingerprintInvalid }),
      branch: z.string().min(1, { error: errors.branchRequired }),
      department: z.string().min(1, { error: errors.departmentRequired }),
      position: z
        .string()
        .min(1, { error: errors.positionRequired })
        .min(2, { error: errors.positionMin }),
      password: z
        .string()
        .min(1, { error: errors.passwordRequired })
        .min(8, { error: errors.passwordMin }),
      confirmPassword: z
        .string()
        .min(1, { error: errors.confirmPasswordRequired }),
      avatar: z
        .custom<File | undefined>(
          (value) => value === undefined || value instanceof File,
          { message: errors.avatarInvalidType },
        )
        .optional()
        .refine((file) => !file || file.type.startsWith("image/"), {
          message: errors.avatarInvalidType,
        })
        .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
          message: errors.avatarTooLarge,
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      error: errors.passwordMismatch,
    });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
