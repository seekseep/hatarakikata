import type { FindCareerQuestionQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerQuestionRowToEntity } from '../../converter'

export const findCareerQuestionQuery: FindCareerQuestionQuery = async ({ id }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('career_questions')
    .select('id, career_map_id, name, title, status, fields, row, start_date, end_date')
    .eq('id', id)
    .maybeSingle()

  if (error) return failAsExternalServiceError(error.message, error)
  if (!data) return succeed(null)

  return succeed(careerQuestionRowToEntity(data))
}
