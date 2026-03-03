import type { ListGuidesByUserIdQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { guideRowToEntity } from '../../converter'

export const listGuidesByUserIdQuery: ListGuidesByUserIdQuery = async ({ userId }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('guides')
    .select('id, user_id, career_map_id, content, next_actions, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed((data ?? []).map(guideRowToEntity))
}
