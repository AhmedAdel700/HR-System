import { z } from "zod";
import type { RequestType } from "@/lib/employee/demo-data";

export type RequestFormErrorMessages = {
  fromRequired: string;
  toRequired: string;
  rangeInvalid: string;
  startTimeRequired: string;
  endTimeRequired: string;
  timeInvalid: string;
  reasonRequired: string;
  reasonMin: string;
};

export function createRequestSchema(
  type: RequestType,
  errors: RequestFormErrorMessages
) {
  const base = z.object({
    from: z.string().min(1, { error: errors.fromRequired }),
    to: z.string().min(1, { error: errors.toRequired }),
    reason: z
      .string()
      .min(1, { error: errors.reasonRequired })
      .min(5, { error: errors.reasonMin }),
    note: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  });

  if (type === "permission") {
    return base
      .extend({
        startTime: z.string().min(1, { error: errors.startTimeRequired }),
        endTime: z.string().min(1, { error: errors.endTimeRequired }),
      })
      .refine((data) => data.to >= data.from, {
        path: ["to"],
        error: errors.rangeInvalid,
      })
      .refine((data) => data.endTime > data.startTime, {
        path: ["endTime"],
        error: errors.timeInvalid,
      });
  }

  return base.refine((data) => data.to >= data.from, {
    path: ["to"],
    error: errors.rangeInvalid,
  });
}

export type RequestFormValues = z.infer<ReturnType<typeof createRequestSchema>>;
