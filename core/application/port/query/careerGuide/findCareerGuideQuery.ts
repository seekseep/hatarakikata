import { z } from "zod"

import { CareerGuide, CareerGuideKeySchema } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const FindCareerGuideQueryParametersSchema = CareerGuideKeySchema

export type FindCareerGuideQueryParametersInput = z.input<typeof FindCareerGuideQueryParametersSchema>

export type FindCareerGuideQueryParameters = z.infer<typeof FindCareerGuideQueryParametersSchema>

export type FindCareerGuideQuery = (parameters: FindCareerGuideQueryParametersInput) => Promise<AppResult<null | CareerGuide>>
