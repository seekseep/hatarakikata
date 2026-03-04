export { buildElementarySchool } from "./buildElementarySchool"
export { buildHighSchool } from "./buildHighSchool"
export { buildMiddleSchool } from "./buildMiddleSchool"
export { buildUniversity } from "./buildUniversity"
export type { QuestionBuilder, QuestionBuilderParams, QuestionBuilderResult } from "./types"

import { buildElementarySchool } from "./buildElementarySchool"
import { buildHighSchool } from "./buildHighSchool"
import { buildMiddleSchool } from "./buildMiddleSchool"
import { buildUniversity } from "./buildUniversity"
import type { QuestionBuilder } from "./types"

export const QUESTION_BUILDERS: QuestionBuilder[] = [
  buildElementarySchool,
  buildMiddleSchool,
  buildHighSchool,
  buildUniversity,
]
