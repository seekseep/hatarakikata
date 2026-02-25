'use client'

import { useMutation,useQuery } from '@tanstack/react-query'

import type { UpdateCareerMapParametersInput } from '@/core/application/usecase/careerMap/updateCareerMap'
import {
  createMyCareerMap,
  getCareerMap,
  listCareerMapsByUserId,
  listCarrerMapSummaries,
  listMyCareerMaps,
  listSimilarCareerMaps,
  updateCareerMap,
} from '@/ui/service/api'

const CAREER_MAPS_QUERY_KEY = ['careerMaps'] as const
const CAREER_MAP_QUERY_KEY = ['careerMap'] as const
const SIMILAR_CAREER_MAPS_QUERY_KEY = ['similarCareerMaps'] as const
const CARRER_MAP_SUMMARIES_QUERY_KEY = ['carrerMapSummaries'] as const

export function useCareerMapsByUserIdQuery(userId: string | undefined) {
  return useQuery({
    queryKey: [...CAREER_MAPS_QUERY_KEY, userId],
    queryFn: () => listCareerMapsByUserId({ userId: userId! }),
    enabled: !!userId,
  })
}

export function useMyCareerMapsQuery() {
  return useQuery({
    queryKey: [...CAREER_MAPS_QUERY_KEY, 'me'],
    queryFn: () => listMyCareerMaps(),
  })
}

export function useCreateMyCareerMapMutation() {
  return useMutation({
    mutationFn: () => createMyCareerMap(),
  })
}

export function useCareerMapQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...CAREER_MAP_QUERY_KEY, id],
    queryFn: () => getCareerMap({ id: id! }),
    enabled: !!id,
  })
}

export function useUpdateCareerMapMutation() {
  return useMutation({
    mutationFn: (input: UpdateCareerMapParametersInput) => updateCareerMap(input),
  })
}

export function useSimilarCareerMapsQuery(careerMapId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: [...SIMILAR_CAREER_MAPS_QUERY_KEY, careerMapId],
    queryFn: () => listSimilarCareerMaps({ careerMapId: careerMapId! }),
    enabled: !!careerMapId && enabled,
  })
}

export function useCarrerMapSummariesQuery(enabled: boolean) {
  return useQuery({
    queryKey: [...CARRER_MAP_SUMMARIES_QUERY_KEY],
    queryFn: () => listCarrerMapSummaries({ limit: 10 }),
    enabled,
  })
}
