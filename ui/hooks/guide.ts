'use client'

import { useMutation, useQuery } from '@tanstack/react-query'

import type { CreateGuideParametersInput } from '@/core/application/usecase/guide/createGuide'
import {
  createGuide,
  getGuide,
  listMyGuides,
} from '@/ui/service/api'

const GUIDES_QUERY_KEY = ['guides'] as const
const GUIDE_QUERY_KEY = ['guide'] as const

export function useMyGuidesQuery() {
  return useQuery({
    queryKey: [...GUIDES_QUERY_KEY, 'me'],
    queryFn: () => listMyGuides(),
  })
}

export function useGuideQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...GUIDE_QUERY_KEY, id],
    queryFn: () => getGuide({ id: id! }),
    enabled: !!id,
  })
}

export function useCreateGuideMutation() {
  return useMutation({
    mutationFn: (input: CreateGuideParametersInput) => createGuide(input),
  })
}
