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
        user_id: params.userId,
        name: params.name,
        title: params.title,
        status: params.status ?? 'open',
        fields: params.fields,
      })
      .select('id, user_id, name, title, status, fields')
      .single()

    if (error) return failAsExternalServiceError(error.message, error)
    return succeed(careerQuestionRowToEntity(data))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
