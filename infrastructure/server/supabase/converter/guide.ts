import type { Guide } from "@/core/domain/entity/guide"

import type { GuideRow } from "../schemas"

export function guideRowToEntity(row: GuideRow): Guide {
  return {
    id: row.id,
    userId: row.user_id,
    careerMapId: row.career_map_id,
    content: row.content,
    nextActions: row.next_actions,
    createdAt: row.created_at,
  }
}
