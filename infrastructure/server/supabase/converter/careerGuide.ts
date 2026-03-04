import type { CareerGuide, CareerGuideWithSource } from "@/core/domain/entity/careerGuide"

import type { CareerGuideRow } from "../schemas"

export function careerGuideRowToEntity(row: CareerGuideRow): CareerGuide {
  return {
    id: row.id,
    userId: row.user_id,
    baseCareerMapId: row.base_career_map_id,
    guideCareerMapId: row.guide_career_map_id,
    content: row.content,
    nextActions: row.next_actions,
    createdAt: row.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function careerGuideRowWithSourceToEntity(row: any): CareerGuideWithSource {
  const baseCareerMap = row.base_career_map as { user_id: string; users: { name: string | null } } | null
  return {
    id: row.id,
    userId: row.user_id,
    baseCareerMapId: row.base_career_map_id,
    guideCareerMapId: row.guide_career_map_id,
    content: row.content,
    nextActions: row.next_actions,
    createdAt: row.created_at,
    sourceUserName: baseCareerMap?.users?.name ?? null,
  }
}
