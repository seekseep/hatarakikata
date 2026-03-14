import z from "zod";

import { MembershipPlanSchema } from "@/core/application/port/query/membership/getMembershipQuery"
import { createPagedItemsSchema } from "@/core/domain/schema"

export const UserKeySchema = z.object({
  id: z.string(),
})

export const UserPayloadSchema = z.object({
  name: z.string().nullable(),
})

export const UserMembershipSchema = z.object({
  plan: MembershipPlanSchema,
})

export const UserSchema = UserKeySchema.extend(UserPayloadSchema.shape).extend({
  balance: z.number(),
  membership: UserMembershipSchema,
})
export type User = z.infer<typeof UserSchema>

export const PagedUsersSchema = createPagedItemsSchema(UserSchema)
export type PagedUsers = z.infer<typeof PagedUsersSchema>
