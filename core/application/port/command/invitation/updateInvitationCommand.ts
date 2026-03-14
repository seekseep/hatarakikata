import { z } from "zod"

import { AppResult } from "@/core/util/appResult"

export const UpdateInvitationCommandParametersSchema = z.object({
  invitationId: z.string(),
})

export type UpdateInvitationCommandParametersInput = z.input<typeof UpdateInvitationCommandParametersSchema>

export type UpdateInvitationCommandParameters = z.infer<typeof UpdateInvitationCommandParametersSchema>

export type UpdateInvitationCommand = (parameters: UpdateInvitationCommandParametersInput) => Promise<AppResult<void>>
