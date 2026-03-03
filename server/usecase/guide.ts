import { makeCreateGuide } from '@/core/application/usecase/guide/createGuide'
import { makeGetGuide } from '@/core/application/usecase/guide/getGuide'
import { makeListMyGuides } from '@/core/application/usecase/guide/listMyGuides'
import { createGuideCommand } from '@/infrastructure/server/supabase/command'
import { findCareerMapQuery, findGuideQuery, listGuidesByUserIdQuery } from '@/infrastructure/server/supabase/query'

export const createGuide = makeCreateGuide({
  findCareerMapQuery,
  createGuideCommand,
})

export const getGuide = makeGetGuide({
  findGuideQuery,
})

export const listMyGuides = makeListMyGuides({
  listGuidesByUserIdQuery,
})
