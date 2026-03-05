import type { CareerEvent, CareerQuestion } from '@/core/domain'

import { apiFetch } from './client'

export function listQuestions(careerMapId: string): Promise<CareerQuestion[]> {
  return apiFetch<CareerQuestion[]>(`/api/questions?careerMapId=${encodeURIComponent(careerMapId)}`)
}

export function initializeQuestions(careerMapId: string): Promise<CareerQuestion[]> {
  return apiFetch<CareerQuestion[]>('/api/questions/init', {
    method: 'POST',
    body: JSON.stringify({ careerMapId }),
  })
}

export function answerQuestion(id: string, answer: Record<string, unknown>): Promise<CareerEvent> {
  return apiFetch<CareerEvent>(`/api/career-questions/${id}/answer`, {
    method: 'POST',
    body: JSON.stringify(answer),
  })
}

export function closeQuestion(id: string): Promise<CareerQuestion> {
  return apiFetch<CareerQuestion>(`/api/career-questions/${id}/close`, { method: 'POST' })
}
