import type { ListCareerEventsByCareerMapIdQuery } from '@/core/application/port/query'
import { failAsExternalServiceError,succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerEventRowToEntity } from '../../converter'
import type { CareerEventWithTagsRow } from '../../schemas'

export const listCareerEventsByCareerMapIdQuery: ListCareerEventsByCareerMapIdQuery = async ({ careerMapId }) => {
  const supabase = createSupabaseAdmin()
  const { data, error, count } = await supabase
    .from('career_events')
    .select('id, career_map_id, name, type, start_date, end_date, strength, row, description, career_map_event_tag_attachments(career_map_event_tags(id, name))', { count: 'exact' })
    .eq('career_map_id', careerMapId)

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed({
    items: (data ?? []).map((row) => careerEventRowToEntity(row as unknown as CareerEventWithTagsRow)),
    count: count ?? 0,
    offset: 0,
    limit: (data ?? []).length,
  })
}
