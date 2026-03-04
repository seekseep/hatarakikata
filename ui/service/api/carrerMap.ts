import type { GetCareerMapParametersInput } from '@/core/application/usecase/careerMap/getCareerMap'
import type { UpdateCareerMapParametersInput } from '@/core/application/usecase/careerMap/updateCareerMap'
import type { CareerMap, PagedCareerMaps } from '@/core/domain'
import type { PagedCarrerMapSummaries } from '@/core/domain/value/carrerMapSummary'

import { apiFetch } from './client'

export function listCareerMapsByUserId(input: { userId: string }): Promise<PagedCareerMaps> {
  return apiFetch<PagedCareerMaps>(`/api/users/${input.userId}/career-maps`)
}

export function listMyCareerMaps(): Promise<PagedCareerMaps> {
  return apiFetch<PagedCareerMaps>('/api/me/career-maps')
}

export function createMyCareerMap(): Promise<CareerMap> {
  return apiFetch<CareerMap>('/api/me/career-maps', { method: 'POST' })
}

export function getCareerMap(input: GetCareerMapParametersInput): Promise<CareerMap> {
  return apiFetch<CareerMap>(`/api/career-maps/${input.id}`)
}

export function updateCareerMap(input: UpdateCareerMapParametersInput): Promise<CareerMap> {
  const { id, ...body } = input
  return apiFetch<CareerMap>(`/api/career-maps/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export type SimilarCareerMap = {
  id: string
  userId: string
  userName: string | null
  score: number
  overlapTags: { id: string; name: string }[]
}

export type SimilarCareerMapsResponse = {
  items: SimilarCareerMap[]
  count: number
}

export function listSimilarCareerMaps(input: { careerMapId: string; limit?: number }): Promise<SimilarCareerMapsResponse> {
  const limit = input.limit ?? 10
  return apiFetch<SimilarCareerMapsResponse>(`/api/career-maps/${input.careerMapId}/similar?limit=${limit}`)
}

export function listCarrerMapSummaries(input?: { limit?: number; offset?: number }): Promise<PagedCarrerMapSummaries> {
  const params = new URLSearchParams()
  if (input?.limit != null) params.set('limit', String(input.limit))
  if (input?.offset != null) params.set('offset', String(input.offset))
  const query = params.toString()
  return apiFetch<PagedCarrerMapSummaries>(`/api/carrer-map-summaries${query ? `?${query}` : ''}`)
}
