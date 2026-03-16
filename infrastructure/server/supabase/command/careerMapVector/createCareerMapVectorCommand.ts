import type { CreateCareerMapVectorCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const createCareerMapVectorCommand: CreateCareerMapVectorCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase
    .from('career_map_vectors')
    .insert({
      career_map_id: parameters.careerMapId,
      embedding: parameters.embedding,
      tag_weights: parameters.tagWeights,
      updated_at: new Date().toISOString(),
    })

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed(undefined)
}
