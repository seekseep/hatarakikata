import { makeGetCareerMap } from '@/core/application/usecase/careerMap/getCareerMap'
import { makeReindexAllCareerMapVectors } from '@/core/application/usecase/careerMap/reindexAllCareerMapVectors'
import { makeUpdateCareerMap } from '@/core/application/usecase/careerMap/updateCareerMap'
import { createEmbeddingOperation } from '@/infrastructure/server/ai/operation'
import { updateCareerMapCommand, upsertCareerMapVectorCommand } from '@/infrastructure/server/supabase/command'
import { findCareerMapQuery, listAllCareerMapIdsQuery, listCareerEventsForVectorQuery } from '@/infrastructure/server/supabase/query'

export const getCareerMap = makeGetCareerMap({
  findCareerMapQuery,
})

export const updateCareerMap = makeUpdateCareerMap({
  updateCareerMapCommand,
  findCareerMapQuery,
})

export const reindexAllCareerMapVectors = makeReindexAllCareerMapVectors({
  listAllCareerMapIdsQuery,
  listCareerEventsForVectorQuery,
  createEmbeddingOperation,
  upsertCareerMapVectorCommand,
})
