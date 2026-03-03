import type { CreateGuideParametersInput } from '@/core/application/usecase/guide/createGuide'
import type { Guide } from '@/core/domain'

import { apiFetch } from './client'

export function listMyGuides(): Promise<Guide[]> {
  return apiFetch<Guide[]>('/api/guides')
}

export function getGuide(input: { id: string }): Promise<Guide> {
  return apiFetch<Guide>(`/api/guides/${input.id}`)
}

export function createGuide(input: CreateGuideParametersInput): Promise<Guide> {
  return apiFetch<Guide>('/api/guides', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
