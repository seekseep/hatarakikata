'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CareerQuestion } from '@/core/domain'
import {
  answerQuestion,
  closeQuestion,
  initializeQuestions,
  listQuestions,
} from '@/ui/service/api'

const CAREER_QUESTIONS_QUERY_KEY = ['careerQuestions'] as const

export function useCareerQuestionsQuery(careerMapId: string) {
  return useQuery({
    queryKey: [...CAREER_QUESTIONS_QUERY_KEY, careerMapId],
    queryFn: () => listQuestions(careerMapId),
    retry: (failureCount, error) => {
      // 404 はリトライしない（初期化が必要）
      if ('status' in error && (error as { status: number }).status === 404) return false
      return failureCount < 3
    },
  })
}

export function useInitializeQuestionsMutation(careerMapId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => initializeQuestions(careerMapId),
    onSuccess: (data: CareerQuestion[]) => {
      queryClient.setQueryData([...CAREER_QUESTIONS_QUERY_KEY, careerMapId], data)
    },
  })
}

export function useAnswerQuestionMutation(careerMapId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, answer }: { id: string; answer: Record<string, unknown> }) =>
      answerQuestion(id, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CAREER_QUESTIONS_QUERY_KEY, careerMapId] })
    },
  })
}

export function useCloseQuestionMutation(careerMapId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => closeQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CAREER_QUESTIONS_QUERY_KEY, careerMapId] })
    },
  })
}
