import type { CreateCareerGuideParametersInput } from '@/core/application/usecase/careerGuide/createCareerGuide'
import type { CareerGuide, CareerGuideWithSource } from '@/core/domain'

import { apiFetch } from './client'

export function listMyCareerGuides(): Promise<CareerGuideWithSource[]> {
  return apiFetch<CareerGuideWithSource[]>('/api/career-guides')
}

export function getCareerGuide(input: { id: string }): Promise<CareerGuide> {
  return apiFetch<CareerGuide>(`/api/career-guides/${input.id}`)
}

export function createCareerGuide(input: CreateCareerGuideParametersInput): Promise<CareerGuide> {
  return apiFetch<CareerGuide>('/api/career-guides', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
