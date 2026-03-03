import { z } from "zod"

import { CareerQuestion, CareerQuestionKeySchema } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const FindCareerQuestionQueryParametersSchema = CareerQuestionKeySchema

export type FindCareerQuestionQueryParametersInput = z.input<typeof FindCareerQuestionQueryParametersSchema>

export type FindCareerQuestionQueryParameters = z.infer<typeof FindCareerQuestionQueryParametersSchema>

export type FindCareerQuestionQuery = (parameters: FindCareerQuestionQueryParametersInput) => Promise<AppResult<null | CareerQuestion>>
