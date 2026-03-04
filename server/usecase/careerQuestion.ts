import { makeGetQuestionsByUserId } from '@/core/application/usecase/careerQuestion/getQuestionsByUserId'
import { makeInitializeQuestionsForUser } from '@/core/application/usecase/careerQuestion/initializeQuestionsForUser'
import { makeAnswerQuestion } from '@/core/application/usecase/careerQuestion/answerQuestion'
import { makeCloseQuestion } from '@/core/application/usecase/careerQuestion/closeQuestion'
import { createCareerEventCommand } from '@/infrastructure/server/supabase/command'
import { createCareerQuestionCommand, updateCareerQuestionCommand } from '@/infrastructure/server/supabase/command'
import { listCareerQuestionsByUserIdQuery, findCareerQuestionQuery, listCareerMapByUserIdQuery } from '@/infrastructure/server/supabase/query'

export const getQuestionsByUserId = makeGetQuestionsByUserId({
  listCareerQuestionsByUserIdQuery,
})

export const initializeQuestionsForUser = makeInitializeQuestionsForUser({
  createCareerQuestionCommand,
  listCareerQuestionsByUserIdQuery,
  listCareerMapByUserIdQuery,
})

export const answerQuestion = makeAnswerQuestion({
  findCareerQuestionQuery,
  updateCareerQuestionCommand,
  createCareerEventCommand,
  listCareerMapByUserIdQuery,
})

export const closeQuestion = makeCloseQuestion({
  findCareerQuestionQuery,
  updateCareerQuestionCommand,
})
