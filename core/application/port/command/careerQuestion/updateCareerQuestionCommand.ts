import { z } from "zod"

import { CareerQuestionKeySchema } from "@/core/domain"
import { CareerQuestionPayloadSchema } from "@/core/domain/entity/careerQuestion"
import { AppResult } from "@/core/util/appResult"

export const UpdateCareerQuestionCommandParametersSchema = CareerQuestionKeySchema.extend(
  CareerQuestionPayloadSchema.partial().shape,
)

export type UpdateCareerQuestionCommandParametersInput = z.input<typeof UpdateCareerQuestionCommandParametersSchema>

export type UpdateCareerQuestionCommandParameters = z.infer<typeof UpdateCareerQuestionCommandParametersSchema>

export type UpdateCareerQuestionCommand = (parameters: UpdateCareerQuestionCommandParametersInput) => Promise<AppResult<void>>
