import type { ListCareerGuidesByUserIdQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerGuideRowWithSourceToEntity } from '../../converter'

export const listCareerGuidesByUserIdQuery: ListCareerGuidesByUserIdQuery = async ({ userId }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('career_guides')
    .select('id, user_id, base_career_map_id, guide_career_map_id, content, next_actions, created_at, base_career_map:career_maps!base_career_map_id(user_id, users(name))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed((data ?? []).map(careerGuideRowWithSourceToEntity))
}
