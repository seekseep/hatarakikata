import { z } from "zod"

import { Guide, GuidePayloadSchema } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const CreateGuideCommandParametersSchema = GuidePayloadSchema

export type CreateGuideCommandParametersInput = z.input<typeof CreateGuideCommandParametersSchema>

export type CreateGuideCommandParameters = z.infer<typeof CreateGuideCommandParametersSchema>

export type CreateGuideCommand = (parameters: CreateGuideCommandParametersInput) => Promise<AppResult<Guide>>
