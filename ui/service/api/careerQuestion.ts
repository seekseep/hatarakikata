import type { CareerEvent, CareerQuestion } from '@/core/domain'

import { apiFetch } from './client'

export function listQuestions(): Promise<CareerQuestion[]> {
  return apiFetch<CareerQuestion[]>('/api/questions')
}

export function initializeQuestions(): Promise<CareerQuestion[]> {
  return apiFetch<CareerQuestion[]>('/api/questions/init', { method: 'POST' })
}

export function answerQuestion(id: string, answer: Record<string, unknown>): Promise<CareerEvent> {
  return apiFetch<CareerEvent>(`/api/questions/${id}/answer`, {
    method: 'POST',
    body: JSON.stringify(answer),
  })
}

export function closeQuestion(id: string): Promise<CareerQuestion> {
  return apiFetch<CareerQuestion>(`/api/questions/${id}/close`, { method: 'POST' })
}
