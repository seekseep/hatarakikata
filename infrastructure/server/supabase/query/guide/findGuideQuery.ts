import type { FindGuideQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { guideRowToEntity } from '../../converter'

export const findGuideQuery: FindGuideQuery = async ({ id }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('guides')
    .select('id, user_id, career_map_id, content, next_actions, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) return failAsExternalServiceError(error.message, error)
  if (!data) return succeed(null)

  return succeed(guideRowToEntity(data))
}
