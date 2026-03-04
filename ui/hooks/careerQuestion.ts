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

export function useCareerQuestionsQuery() {
  return useQuery({
    queryKey: [...CAREER_QUESTIONS_QUERY_KEY],
    queryFn: () => listQuestions(),
    retry: (failureCount, error) => {
      // 404 はリトライしない（初期化が必要）
      if ('status' in error && (error as { status: number }).status === 404) return false
      return failureCount < 3
    },
  })
}

export function useInitializeQuestionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => initializeQuestions(),
    onSuccess: (data: CareerQuestion[]) => {
      queryClient.setQueryData([...CAREER_QUESTIONS_QUERY_KEY], data)
    },
  })
}

export function useAnswerQuestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, answer }: { id: string; answer: Record<string, unknown> }) =>
      answerQuestion(id, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CAREER_QUESTIONS_QUERY_KEY] })
    },
  })
}

export function useCloseQuestionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => closeQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CAREER_QUESTIONS_QUERY_KEY] })
    },
  })
}
