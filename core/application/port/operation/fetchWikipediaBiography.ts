import { z } from "zod"

import type { AppResult } from "@/core/util/appResult"

export const FetchWikipediaBiographyOperationParametersSchema = z.object({
  personName: z.string().min(1),
  language: z.string().default("ja"),
})

export type FetchWikipediaBiographyOperationParametersInput = z.input<
  typeof FetchWikipediaBiographyOperationParametersSchema
>

export type FetchWikipediaBiographyOperationParameters = z.infer<
  typeof FetchWikipediaBiographyOperationParametersSchema
>

export type FetchWikipediaBiographyOperationResult = {
  title: string
  content: string
  url: string
}

export type FetchWikipediaBiographyOperation = (
  parameters: FetchWikipediaBiographyOperationParameters
) => Promise<AppResult<FetchWikipediaBiographyOperationResult>>
