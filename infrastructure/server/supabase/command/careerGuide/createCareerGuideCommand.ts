import type { CreateCareerGuideCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerGuideRowToEntity } from '../../converter'

export const createCareerGuideCommand: CreateCareerGuideCommand = async (parameters) => {
  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('career_guides')
      .insert({
        user_id: parameters.userId,
        base_career_map_id: parameters.baseCareerMapId,
        guide_career_map_id: parameters.guideCareerMapId,
        content: parameters.content,
        next_actions: parameters.nextActions,
      })
      .select('id, user_id, base_career_map_id, guide_career_map_id, content, next_actions, created_at')
      .single()

    if (error) return failAsExternalServiceError(error.message, error)
    return succeed(careerGuideRowToEntity(data))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
