import { z } from "zod"

import { CareerGuide, CareerGuidePayloadSchema } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const CreateCareerGuideCommandParametersSchema = CareerGuidePayloadSchema

export type CreateCareerGuideCommandParametersInput = z.input<typeof CreateCareerGuideCommandParametersSchema>

export type CreateCareerGuideCommandParameters = z.infer<typeof CreateCareerGuideCommandParametersSchema>

export type CreateCareerGuideCommand = (parameters: CreateCareerGuideCommandParametersInput) => Promise<AppResult<CareerGuide>>
