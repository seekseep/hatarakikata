import { makeGetSimilarCareerMaps } from '@/core/application/usecase/careerMap/getSimilarCareerMaps'
import { findCareerMapEventTagsByIdsQuery, findCareerMapQuery, findCareerMapVectorQuery, matchCareerMapVectorsQuery } from '@/infrastructure/server/supabase/query'

export const getSimilarCareerMaps = makeGetSimilarCareerMaps({
  findCareerMapQuery,
  findCareerMapVectorQuery,
  matchCareerMapVectorsQuery,
  findCareerMapEventTagsByIdsQuery,
})
