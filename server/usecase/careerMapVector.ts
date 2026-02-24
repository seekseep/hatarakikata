import { makeCreateCareerMapVectorOperation } from '@/core/application/service'
import { makeGetSimilarCareerMaps } from '@/core/application/usecase/careerMap/getSimilarCareerMaps'
import { createEmbeddingOperation } from '@/infrastructure/server/ai/operation'
import { createCareerMapVectorCommand } from '@/infrastructure/server/supabase/command'
import { findCareerMapEventTagsByIdsQuery, findCareerMapQuery, findCareerMapVectorQuery, listCareerEventsForVectorQuery, matchCareerMapVectorsQuery } from '@/infrastructure/server/supabase/query'

const createCareerMapVectorOperation = makeCreateCareerMapVectorOperation({
  listCareerEventsForVectorQuery,
  createEmbeddingOperation,
  createCareerMapVectorCommand,
})

export const getSimilarCareerMaps = makeGetSimilarCareerMaps({
  findCareerMapQuery,
  findCareerMapVectorQuery,
  createCareerMapVectorOperation,
  matchCareerMapVectorsQuery,
  findCareerMapEventTagsByIdsQuery,
})
