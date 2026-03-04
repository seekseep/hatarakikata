import type { FindCareerEventQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerEventRowToEntity } from '../../converter'
import type { CareerEventWithTagsRow } from '../../schemas'

export const findCareerEventQuery: FindCareerEventQuery = async ({ id }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('career_events')
    .select('id, career_map_id, name, type, start_date, end_date, strength, row, description, career_map_event_tag_attachments(career_map_event_tags(id, name))')
    .eq('id', id)
    .maybeSingle()

  if (error) return failAsExternalServiceError(error.message, error)
  if (!data) return succeed(null)

  return succeed(careerEventRowToEntity(data as unknown as CareerEventWithTagsRow))
}
