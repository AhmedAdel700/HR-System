import { z } from "zod";

export type PositionFormErrorMessages = {
  nameRequired: string;
  nameMin: string;
};

export function createPositionSchema(errors: PositionFormErrorMessages) {
  return z.object({
    name: z
      .string()
      .min(1, { error: errors.nameRequired })
      .min(2, { error: errors.nameMin }),
  });
}

export type PositionFormValues = z.infer<
  ReturnType<typeof createPositionSchema>
>;
