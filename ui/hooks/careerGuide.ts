'use client'

import { useMutation, useQuery } from '@tanstack/react-query'

import type { CreateCareerGuideParametersInput } from '@/core/application/usecase/careerGuide/createCareerGuide'
import {
  createCareerGuide,
  getCareerGuide,
  listMyCareerGuides,
} from '@/ui/service/api'

const GUIDES_QUERY_KEY = ['career-guides'] as const
const GUIDE_QUERY_KEY = ['career-guide'] as const

export function useMyCareerGuidesQuery() {
  return useQuery({
    queryKey: [...GUIDES_QUERY_KEY, 'me'],
    queryFn: () => listMyCareerGuides(),
  })
}

export function useCareerGuideQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...GUIDE_QUERY_KEY, id],
    queryFn: () => getCareerGuide({ id: id! }),
    enabled: !!id,
  })
}

export function useCreateCareerGuideMutation() {
  return useMutation({
    mutationFn: (input: CreateCareerGuideParametersInput) => createCareerGuide(input),
  })
}
