import { z } from "zod";

export type UpdateEmployeeAssignmentFormErrorMessages = {
  branchRequired: string;
  departmentRequired: string;
  positionRequired: string;
  positionMin: string;
  fingerprintRequired: string;
  fingerprintInvalid: string;
};

export function updateEmployeeAssignmentSchema(
  errors: UpdateEmployeeAssignmentFormErrorMessages
) {
  return z.object({
    branch: z.string().min(1, { error: errors.branchRequired }),
    department: z.string().min(1, { error: errors.departmentRequired }),
    position: z
      .string()
      .min(1, { error: errors.positionRequired })
      .min(2, { error: errors.positionMin }),
    fingerprintNumber: z
      .string()
      .min(1, { error: errors.fingerprintRequired })
      .regex(/^[0-9]{1,20}$/, { error: errors.fingerprintInvalid }),
  });
}

export type UpdateEmployeeAssignmentFormValues = z.infer<
  ReturnType<typeof updateEmployeeAssignmentSchema>
>;
