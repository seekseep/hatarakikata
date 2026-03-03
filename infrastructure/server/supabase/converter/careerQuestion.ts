import type { CareerQuestion } from "@/core/domain/entity/careerQuestion"

import type { CareerQuestionRow } from "../schemas"

export function careerQuestionRowToEntity(row: CareerQuestionRow): CareerQuestion {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    status: row.status,
    fields: row.fields,
  }
}
