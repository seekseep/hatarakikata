import type { MatchCareerMapVectorsQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const matchCareerMapVectorsQuery: MatchCareerMapVectorsQuery = async (parameters) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase.rpc('match_career_map_vectors', {
    query_embedding: JSON.stringify(parameters.embedding),
    match_count: parameters.matchCount,
    exclude_career_map_id: parameters.excludeCareerMapId,
  })

  if (error) return failAsExternalServiceError(error.message, error)

  const rows = (data ?? []) as { career_map_id: string; similarity: number; tag_weights: Record<string, number>; user_name: string | null }[]
  return succeed(rows.map((row) => ({
    careerMapId: row.career_map_id,
    similarity: row.similarity,
    tagWeights: row.tag_weights ?? {},
    userName: row.user_name ?? null,
  })))
}
