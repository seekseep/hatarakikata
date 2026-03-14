import { z } from "zod"

import { MembershipPlanSchema } from "@/core/application/port/query/membership/getMembershipQuery"
import { AppResult } from "@/core/util/appResult"

export const CreateMembershipCommandParametersSchema = z.object({
  userId: z.string(),
  plan: MembershipPlanSchema,
})

export type CreateMembershipCommandParametersInput = z.input<typeof CreateMembershipCommandParametersSchema>

export type CreateMembershipCommandParameters = z.infer<typeof CreateMembershipCommandParametersSchema>

export type CreateMembershipCommand = (parameters: CreateMembershipCommandParametersInput) => Promise<AppResult<void>>
