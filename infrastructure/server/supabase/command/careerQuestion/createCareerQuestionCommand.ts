import type { CreateCareerQuestionCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerQuestionRowToEntity } from '../../converter'

export const createCareerQuestionCommand: CreateCareerQuestionCommand = async (params) => {
  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase
      .from('career_questions')
      .insert({
        career_map_id: params.careerMapId,
        name: params.name,
        title: params.title,
        status: params.status ?? 'open',
        fields: params.fields,
        row: params.row ?? null,
        start_date: params.startDate ?? null,
        end_date: params.endDate ?? null,
      })
      .select('id, career_map_id, name, title, status, fields, row, start_date, end_date')
      .single()

    if (error) return failAsExternalServiceError(error.message, error)
    return succeed(careerQuestionRowToEntity(data))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
