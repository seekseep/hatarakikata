import type { UpdateCareerEventCommand } from '@/core/application/port/command'
import { failAsExternalServiceError,succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const updateCareerEventCommand: UpdateCareerEventCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()
  const updateData: Record<string, unknown> = {}
  if (parameters.careerMapId !== undefined) updateData.career_map_id = parameters.careerMapId
  if (parameters.name !== undefined) updateData.name = parameters.name
  if (parameters.type !== undefined) updateData.type = parameters.type
  if (parameters.startDate !== undefined) updateData.start_date = parameters.startDate
  if (parameters.endDate !== undefined) updateData.end_date = parameters.endDate
  if (parameters.strength !== undefined) updateData.strength = parameters.strength
  if (parameters.row !== undefined) updateData.row = parameters.row
  if (parameters.description !== undefined) updateData.description = parameters.description

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from('career_events')
      .update(updateData)
      .eq('id', parameters.id)

    if (error) return failAsExternalServiceError(error.message, error)
  }

  if (parameters.tags !== undefined) {
    const { error: deleteError } = await supabase
      .from('career_map_event_tag_attachments')
      .delete()
      .eq('career_event_id', parameters.id)

    if (deleteError) return failAsExternalServiceError(deleteError.message, deleteError)

    if (parameters.tags.length > 0) {
      const attachments = [...new Set(parameters.tags)].map((tagId) => ({
        career_event_id: parameters.id,
        career_map_event_tag_id: tagId,
      }))

      const { error: insertError } = await supabase
        .from('career_map_event_tag_attachments')
        .insert(attachments)

      if (insertError) return failAsExternalServiceError(insertError.message, insertError)
    }
  }

  return succeed(undefined)
}
