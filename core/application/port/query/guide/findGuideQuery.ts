import { z } from "zod"

import { Guide, GuideKeySchema } from "@/core/domain"
import { AppResult } from "@/core/util/appResult"

export const FindGuideQueryParametersSchema = GuideKeySchema

export type FindGuideQueryParametersInput = z.input<typeof FindGuideQueryParametersSchema>

export type FindGuideQueryParameters = z.infer<typeof FindGuideQueryParametersSchema>

export type FindGuideQuery = (parameters: FindGuideQueryParametersInput) => Promise<AppResult<null | Guide>>
