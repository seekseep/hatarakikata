import { makeAnswerQuestion } from '@/core/application/usecase/careerQuestion/answerQuestion'
import { makeCloseQuestion } from '@/core/application/usecase/careerQuestion/closeQuestion'
import { makeGetQuestionsByCareerMapId } from '@/core/application/usecase/careerQuestion/getQuestionsByCareerMapId'
import { makeInitializeQuestionsForUser } from '@/core/application/usecase/careerQuestion/initializeQuestionsForUser'
import { makeUpdateCareerQuestion } from '@/core/application/usecase/careerQuestion/updateCareerQuestion'
import { createCareerEventCommand } from '@/infrastructure/server/supabase/command'
import { createCareerQuestionCommand, updateCareerQuestionCommand } from '@/infrastructure/server/supabase/command'
import { findCareerMapQuery, findCareerQuestionQuery, listCareerQuestionsByCareerMapIdQuery } from '@/infrastructure/server/supabase/query'

export const getQuestionsByCareerMapId = makeGetQuestionsByCareerMapId({
  listCareerQuestionsByCareerMapIdQuery,
  findCareerMapQuery,
})

export const initializeQuestionsForUser = makeInitializeQuestionsForUser({
  createCareerQuestionCommand,
  listCareerQuestionsByCareerMapIdQuery,
  findCareerMapQuery,
})

export const answerQuestion = makeAnswerQuestion({
  findCareerQuestionQuery,
  updateCareerQuestionCommand,
  createCareerEventCommand,
  createCareerQuestionCommand,
  findCareerMapQuery,
})

export const closeQuestion = makeCloseQuestion({
  findCareerQuestionQuery,
  updateCareerQuestionCommand,
  findCareerMapQuery,
})

export const updateCareerQuestion = makeUpdateCareerQuestion({
  updateCareerQuestionCommand,
  findCareerQuestionQuery,
  findCareerMapQuery,
})
