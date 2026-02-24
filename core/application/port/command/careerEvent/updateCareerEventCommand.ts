import { z } from "zod"

import { CareerEventKeySchema } from "@/core/domain"
import { careerEventPayloadBaseObject } from "@/core/domain/entity/careerEvent"
import { AppResult } from "@/core/util/appResult"

export const UpdateCareerEventCommandParametersSchema = CareerEventKeySchema.extend(
  careerEventPayloadBaseObject.partial().shape,
)

export type UpdateCareerEventCommandParametersInput = z.input<typeof UpdateCareerEventCommandParametersSchema>

export type UpdateCareerEventCommandParameters = z.infer<typeof UpdateCareerEventCommandParametersSchema>

export type UpdateCareerEventCommand = (parameters: UpdateCareerEventCommandParametersInput) => Promise<AppResult<void>>
