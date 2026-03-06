import type { FollowUpQuestionBuilder } from "../types"
import { followUpElementarySchool } from "./followUpElementarySchool"
import { followUpHighSchool } from "./followUpHighSchool"
import { followUpMiddleSchool } from "./followUpMiddleSchool"
import { followUpUniversity } from "./followUpUniversity"

export const FOLLOW_UP_BUILDERS: Record<string, FollowUpQuestionBuilder> = {
  elementary_school: followUpElementarySchool,
  middle_school: followUpMiddleSchool,
  high_school: followUpHighSchool,
  university: followUpUniversity,
}
