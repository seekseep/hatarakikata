import type { CreateGuideCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { guideRowToEntity } from '../../converter'

export const createGuideCommand: CreateGuideCommand = async (params) => {
  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('guides')
      .insert({
        user_id: params.userId,
        career_map_id: params.careerMapId,
        content: params.content,
        next_actions: params.nextActions,
      })
      .select('id, user_id, career_map_id, content, next_actions, created_at')
      .single()

    if (error) return failAsExternalServiceError(error.message, error)
    return succeed(guideRowToEntity(data))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
