import type { CareerQuestion } from "@/core/domain/entity/careerQuestion"

import type { CareerQuestionRow } from "../schemas"

export function careerQuestionRowToEntity(row: CareerQuestionRow): CareerQuestion {
  return {
    id: row.id,
    careerMapId: row.career_map_id,
    name: row.name,
    title: row.title,
    status: row.status,
    fields: row.fields,
    row: row.row ?? undefined,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
  }
}
