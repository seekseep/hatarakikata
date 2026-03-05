import { makeCreateCareerGuide } from '@/core/application/usecase/careerGuide/createCareerGuide'
import { makeGetCareerGuide } from '@/core/application/usecase/careerGuide/getCareerGuide'
import { makeListMyCareerGuides } from '@/core/application/usecase/careerGuide/listMyCareerGuides'
import { generateCareerGuideOperation } from '@/infrastructure/server/ai/operation'
import { createCareerGuideCommand } from '@/infrastructure/server/supabase/command'
import { findCareerGuideQuery, findCareerMapQuery, findUserQuery, listCareerEventsByCareerMapIdQuery, listCareerGuidesByUserIdQuery } from '@/infrastructure/server/supabase/query'

export const createCareerGuide = makeCreateCareerGuide({
  findCareerMapQuery,
  findUserQuery,
  listCareerEventsByCareerMapIdQuery,
  generateCareerGuideOperation,
  createCareerGuideCommand,
})

export const getCareerGuide = makeGetCareerGuide({
  findCareerGuideQuery,
})

export const listMyCareerGuides = makeListMyCareerGuides({
  listCareerGuidesByUserIdQuery,
})
