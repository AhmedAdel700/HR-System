import { z } from "zod";

export type CreateLeaveTypeFormErrorMessages = {
  nameRequired: string;
  nameMin: string;
  unitRequired: string;
  categoryRequired: string;
  categoryMin: string;
  entitlementRequired: string;
  entitlementMin: string;
};

export function createLeaveTypeSchema(errors: CreateLeaveTypeFormErrorMessages) {
  return z.object({
    name: z
      .string()
      .min(1, { error: errors.nameRequired })
      .min(2, { error: errors.nameMin }),
    unit: z.enum(["days", "hours"], { error: errors.unitRequired }),
    category: z
      .string()
      .min(1, { error: errors.categoryRequired })
      .min(2, { error: errors.categoryMin }),
    defaultEntitlement: z
      .string()
      .min(1, { error: errors.entitlementRequired })
      .refine(
        (value) => {
          const parsed = Number(value);
          return Number.isFinite(parsed) && parsed >= 1;
        },
        { error: errors.entitlementMin }
      ),
  });
}

export type CreateLeaveTypeFormValues = z.infer<
  ReturnType<typeof createLeaveTypeSchema>
>;
