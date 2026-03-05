import type { ListCareerQuestionsByCareerMapIdQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerQuestionRowToEntity } from '../../converter'

export const listCareerQuestionsByCareerMapIdQuery: ListCareerQuestionsByCareerMapIdQuery = async ({ careerMapId }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('career_questions')
    .select('id, career_map_id, name, title, status, fields, row, start_date, end_date')
    .eq('career_map_id', careerMapId)

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed((data ?? []).map(careerQuestionRowToEntity))
}
