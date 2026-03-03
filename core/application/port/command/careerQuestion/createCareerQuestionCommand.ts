import { z } from "zod"

import { CareerQuestion, CareerQuestionPayloadSchema } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const CreateCareerQuestionCommandParametersSchema = CareerQuestionPayloadSchema

export type CreateCareerQuestionCommandParametersInput = z.input<typeof CreateCareerQuestionCommandParametersSchema>

export type CreateCareerQuestionCommandParameters = z.infer<typeof CreateCareerQuestionCommandParametersSchema>

export type CreateCareerQuestionCommand = (parameters: CreateCareerQuestionCommandParametersInput) => Promise<AppResult<CareerQuestion>>
