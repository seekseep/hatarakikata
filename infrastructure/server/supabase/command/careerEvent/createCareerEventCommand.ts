import type { CreateCareerEventCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerEventRowToEntity } from '../../converter'
import type { CareerEventWithTagsRow } from '../../schemas'

const CAREER_EVENT_SELECT_WITH_TAGS = 'id, career_map_id, name, start_name, end_name, type, start_date, end_date, strength, row, description, career_map_event_tag_attachments(career_map_event_tags(id, name))'

export const createCareerEventCommand: CreateCareerEventCommand = async (params) => {
  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('career_events')
      .insert({
        career_map_id: params.careerMapId,
        name: params.name ?? null,
        start_name: params.startName ?? null,
        end_name: params.endName ?? null,
        type: params.type ?? 'working',
        start_date: params.startDate,
        end_date: params.endDate,
        strength: params.strength,
        row: params.row ?? 0,
        description: params.description ?? null,
      })
      .select('id')
      .single()

    if (error) return failAsExternalServiceError(error.message, error)

    if (params.tags && params.tags.length > 0) {
      const attachments = [...new Set(params.tags)].map((tagId) => ({
        career_event_id: data.id,
        career_map_event_tag_id: tagId,
      }))

      const { error: attachError } = await supabase
        .from('career_map_event_tag_attachments')
        .insert(attachments)

      if (attachError) return failAsExternalServiceError(attachError.message, attachError)
    }

    const { data: fullData, error: fetchError } = await supabase
      .from('career_events')
      .select(CAREER_EVENT_SELECT_WITH_TAGS)
      .eq('id', data.id)
      .single()

    if (fetchError) return failAsExternalServiceError(fetchError.message, fetchError)

    return succeed(careerEventRowToEntity(fullData as unknown as CareerEventWithTagsRow))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
