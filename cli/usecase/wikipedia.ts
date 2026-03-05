import { makeDownloadWikipediaBiography } from '@/core/application/usecase/careerMap/downloadWikipediaBiography'
import { makeGenerateCareerFromBiography } from '@/core/application/usecase/careerMap/generateCareerFromBiography'
import { makeImportCareerData } from '@/core/application/usecase/careerMap/importCareerData'
import { makeListCareerData } from '@/core/application/usecase/careerMap/listCareerData'
import { generateCareerEventsFromBiography } from '@/infrastructure/server/ai/operation/generateCareerEventsFromBiography'
import { saveCareerDataCommand } from '@/infrastructure/server/fs/command/careerData/saveCareerDataCommand'
import { saveWikipediaMarkdownCacheCommand } from '@/infrastructure/server/fs/command/wikipedia/saveWikipediaMarkdownCacheCommand'
import { listCareerDataQuery } from '@/infrastructure/server/fs/query/careerData/listCareerDataQuery'
import { readCareerDataQuery } from '@/infrastructure/server/fs/query/careerData/readCareerDataQuery'
import { readWikipediaMarkdownCacheQuery } from '@/infrastructure/server/fs/query/wikipedia/readWikipediaMarkdownCacheQuery'
import { createCareerEventCommand } from '@/infrastructure/server/supabase/command/careerEvent/createCareerEventCommand'
import { createCareerMapCommand } from '@/infrastructure/server/supabase/command/careerMap/createCareerMapCommand'
import { createUserCommand, deleteUserCommand } from '@/infrastructure/server/supabase/command/user'
import { listCareerMapEventTagsQuery } from '@/infrastructure/server/supabase/query/careerMapEventTag/listCareerMapEventTagsQuery'
import { findUserByNameQuery, listUserNamesQuery } from '@/infrastructure/server/supabase/query/user'
import { fetchWikipediaBiography } from '@/infrastructure/server/wikipedia/fetchWikipediaBiography'

export const downloadWikipediaBiography = makeDownloadWikipediaBiography({
  fetchWikipediaBiography,
  readWikipediaMarkdownCacheQuery,
  saveWikipediaMarkdownCacheCommand,
})

export const generateCareerFromBiography = makeGenerateCareerFromBiography({
  generateCareerEventsFromBiography,
  listCareerDataQuery,
  listCareerMapEventTagsQuery,
  saveCareerDataCommand,
})

export const importCareerData = makeImportCareerData({
  readCareerDataQuery,
  listUserNamesQuery,
  findUserByNameQuery,
  listCareerMapEventTagsQuery,
  createUserCommand,
  createCareerMapCommand,
  createCareerEventCommand,
  deleteUserCommand,
})

export const listCareerData = makeListCareerData({
  listCareerDataQuery,
})
