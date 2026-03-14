import { z } from "zod"

export const InvitationSchema = z.object({
  id: z.string(),
  code: z.string(),
  usedAt: z.string().nullable(),
})

export type Invitation = z.infer<typeof InvitationSchema>
