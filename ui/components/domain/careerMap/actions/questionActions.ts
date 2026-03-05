import type { CareerQuestion } from "@/core/domain"

import type {
  AnswerQuestionAction,
  CloseQuestionAction,
  RevertProcessQuestionAction,
  SetQuestionsAction,
  StartProcessQuestionAction,
} from "../hooks/EditorAction"

export function setQuestions(questions: CareerQuestion[]): SetQuestionsAction {
  return { type: 'SET_QUESTIONS', questions }
}

export function startProcessQuestion(questionId: string): StartProcessQuestionAction {
  return { type: 'START_PROCESS_QUESTION', questionId }
}

export function revertProcessQuestion(questionId: string): RevertProcessQuestionAction {
  return { type: 'REVERT_PROCESS_QUESTION', questionId }
}

export function answerQuestion(questionId: string): AnswerQuestionAction {
  return { type: 'ANSWER_QUESTION', questionId }
}

export function closeQuestion(questionId: string): CloseQuestionAction {
  return { type: 'CLOSE_QUESTION', questionId }
}
