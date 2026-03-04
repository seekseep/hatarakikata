import type { ListCareerQuestionsByUserIdQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerQuestionRowToEntity } from '../../converter'

export const listCareerQuestionsByUserIdQuery: ListCareerQuestionsByUserIdQuery = async ({ userId }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('career_questions')
    .select('id, user_id, name, title, status, fields, row, start_date, end_date')
    .eq('user_id', userId)

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed((data ?? []).map(careerQuestionRowToEntity))
}
