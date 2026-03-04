import type { FindCareerGuideQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerGuideRowToEntity } from '../../converter'

export const findCareerGuideQuery: FindCareerGuideQuery = async ({ id }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('career_guides')
    .select('id, user_id, base_career_map_id, guide_career_map_id, content, next_actions, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) return failAsExternalServiceError(error.message, error)
  if (!data) return succeed(null)

  return succeed(careerGuideRowToEntity(data))
}
