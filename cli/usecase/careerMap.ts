import { makeImportCareerData } from '@/core/application/usecase/careerMap/importCareerData'
import { makeListCareerData } from '@/core/application/usecase/careerMap/listCareerData'
import { makeReadjustAllCareerMapRows } from '@/core/application/usecase/careerMap/readjustAllCareerMapRows'
import { makeReindexAllCareerMapVectors } from '@/core/application/usecase/careerMap/reindexAllCareerMapVectors'
import { createEmbeddingOperation } from '@/infrastructure/server/ai/operation'
import { listCareerDataQuery } from '@/infrastructure/server/fs/query/careerData/listCareerDataQuery'
import { readCareerDataQuery } from '@/infrastructure/server/fs/query/careerData/readCareerDataQuery'
import { createCreditTransactionCommand, createMembershipCommand, updateCareerEventCommand, upsertCareerMapVectorCommand } from '@/infrastructure/server/supabase/command'
import { createAuthUserCommand } from '@/infrastructure/server/supabase/command/auth/createAuthUserCommand'
import { deleteAuthUserByEmailCommand } from '@/infrastructure/server/supabase/command/auth/deleteAuthUserByEmailCommand'
import { createCareerEventCommand } from '@/infrastructure/server/supabase/command/careerEvent/createCareerEventCommand'
import { createCareerMapCommand } from '@/infrastructure/server/supabase/command/careerMap/createCareerMapCommand'
import { createUserCommand, deleteUserCommand } from '@/infrastructure/server/supabase/command/user'
import { listAllCareerMapIdsQuery, listCareerEventsByCareerMapIdQuery, listCareerEventsForVectorQuery } from '@/infrastructure/server/supabase/query'
import { listCareerMapEventTagsQuery } from '@/infrastructure/server/supabase/query/careerMapEventTag/listCareerMapEventTagsQuery'
import { findUserByNameQuery, listUserNamesQuery } from '@/infrastructure/server/supabase/query/user'

export function createReadjustAllCareerMapRows(
  onProgress?: (current: number, total: number, failed: number) => void
) {
  return makeReadjustAllCareerMapRows({
    listAllCareerMapIdsQuery,
    listCareerEventsByCareerMapIdQuery,
    updateCareerEventCommand,
    onProgress,
  })
}

export function createReindexAllCareerMapVectors(
  onProgress?: (current: number, total: number, failed: number) => void
) {
  return makeReindexAllCareerMapVectors({
    listAllCareerMapIdsQuery,
    listCareerEventsForVectorQuery,
    createEmbeddingOperation,
    upsertCareerMapVectorCommand,
    onProgress,
  })
}

export const importCareerData = makeImportCareerData({
  readCareerDataQuery,
  listUserNamesQuery,
  findUserByNameQuery,
  listCareerMapEventTagsQuery,
  createAuthUserCommand,
  createUserCommand,
  createCareerMapCommand,
  createCareerEventCommand,
  createMembershipCommand,
  createCreditTransactionCommand,
  deleteAuthUserByEmailCommand,
  deleteUserCommand,
})

export const listCareerData = makeListCareerData({
  listCareerDataQuery,
})
