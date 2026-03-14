import { z } from "zod"

export const UserRowSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
})
export type UserRow = z.infer<typeof UserRowSchema>

export const UserRowWithCreditAndMembershipSchema = UserRowSchema.extend({
  credit_balances: z.array(z.object({ balance: z.number() })).nullable(),
  memberships: z.array(z.object({ plan: z.string() })).nullable(),
})
export type UserRowWithCreditAndMembership = z.infer<typeof UserRowWithCreditAndMembershipSchema>
