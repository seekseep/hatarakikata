import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const MembershipPlanSchema = z.enum(['free', 'premium'])

export type MembershipPlan = z.infer<typeof MembershipPlanSchema>

export const MembershipSchema = z.object({
  userId: z.string(),
  plan: MembershipPlanSchema,
})

export type Membership = z.infer<typeof MembershipSchema>

export const GetMembershipQueryParametersSchema = z.object({
  userId: z.string(),
})

export type GetMembershipQueryParametersInput = z.input<typeof GetMembershipQueryParametersSchema>

export type GetMembershipQueryParameters = z.infer<typeof GetMembershipQueryParametersSchema>

export type GetMembershipQuery = (parameters: GetMembershipQueryParametersInput) => Promise<AppResult<Membership>>
