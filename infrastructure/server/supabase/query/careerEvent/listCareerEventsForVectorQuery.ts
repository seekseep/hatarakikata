import type { ListCareerEventsForVectorQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerEventRowToEntity } from '../../converter'
import type { CareerEventWithTagsRow } from '../../schemas'

export const listCareerEventsForVectorQuery: ListCareerEventsForVectorQuery = async (careerMapId) => {
  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('career_events')
      .select('id, career_map_id, name, type, start_date, end_date, strength, row, description, career_map_event_tag_attachments(career_map_event_tags(id, name))')
      .eq('career_map_id', careerMapId)

    if (error) return failAsExternalServiceError(error.message, error)

    const events = (data ?? []).map((row) => careerEventRowToEntity(row as unknown as CareerEventWithTagsRow))
    return succeed(events)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
