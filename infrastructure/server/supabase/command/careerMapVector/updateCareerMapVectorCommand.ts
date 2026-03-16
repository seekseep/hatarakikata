import type { UpdateCareerMapVectorCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const updateCareerMapVectorCommand: UpdateCareerMapVectorCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase
    .from('career_map_vectors')
    .update({
      embedding: parameters.embedding,
      tag_weights: parameters.tagWeights,
      updated_at: new Date().toISOString(),
    })
    .eq('career_map_id', parameters.careerMapId)

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed(undefined)
}
