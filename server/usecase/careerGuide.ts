import { makeCreateCareerGuide } from '@/core/application/usecase/careerGuide/createCareerGuide'
import { makeGetCareerGuide } from '@/core/application/usecase/careerGuide/getCareerGuide'
import { makeListMyCareerGuides } from '@/core/application/usecase/careerGuide/listMyCareerGuides'
import { createCareerGuideCommand } from '@/infrastructure/server/supabase/command'
import { findCareerGuideQuery, findCareerMapQuery, findUserQuery, listCareerGuidesByUserIdQuery } from '@/infrastructure/server/supabase/query'

export const createCareerGuide = makeCreateCareerGuide({
  findCareerMapQuery,
  findUserQuery,
  createCareerGuideCommand,
})

export const getCareerGuide = makeGetCareerGuide({
  findCareerGuideQuery,
})

export const listMyCareerGuides = makeListMyCareerGuides({
  listCareerGuidesByUserIdQuery,
})
