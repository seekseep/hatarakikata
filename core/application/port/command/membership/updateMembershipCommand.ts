import { z } from "zod"

import { MembershipPlanSchema } from "@/core/application/port/query/membership/getMembershipQuery"
import { AppResult } from "@/core/util/appResult"

export const UpdateMembershipCommandParametersSchema = z.object({
  userId: z.string(),
  plan: MembershipPlanSchema,
})

export type UpdateMembershipCommandParametersInput = z.input<typeof UpdateMembershipCommandParametersSchema>

export type UpdateMembershipCommandParameters = z.infer<typeof UpdateMembershipCommandParametersSchema>

export type UpdateMembershipCommand = (parameters: UpdateMembershipCommandParametersInput) => Promise<AppResult<void>>
