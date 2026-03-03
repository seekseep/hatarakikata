import { z } from "zod"

import { CareerQuestionKeySchema, CareerQuestionStatusSchema } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const UpdateCareerQuestionCommandParametersSchema = CareerQuestionKeySchema.extend({
  status: CareerQuestionStatusSchema.optional(),
})

export type UpdateCareerQuestionCommandParametersInput = z.input<typeof UpdateCareerQuestionCommandParametersSchema>

export type UpdateCareerQuestionCommandParameters = z.infer<typeof UpdateCareerQuestionCommandParametersSchema>

export type UpdateCareerQuestionCommand = (parameters: UpdateCareerQuestionCommandParametersInput) => Promise<AppResult<void>>
