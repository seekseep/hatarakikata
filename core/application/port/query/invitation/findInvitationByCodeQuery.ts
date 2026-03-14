import { z } from "zod"

import type { Invitation } from "@/core/domain/entity/invitation"
import { AppResult } from "@/core/util/appResult"

export const FindInvitationByCodeQueryParametersSchema = z.object({
  code: z.string(),
})

export type FindInvitationByCodeQueryParametersInput = z.input<typeof FindInvitationByCodeQueryParametersSchema>

export type FindInvitationByCodeQueryParameters = z.infer<typeof FindInvitationByCodeQueryParametersSchema>

export type FindInvitationByCodeQuery = (parameters: FindInvitationByCodeQueryParametersInput) => Promise<AppResult<Invitation | null>>
