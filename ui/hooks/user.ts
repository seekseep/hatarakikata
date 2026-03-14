'use client'

import { useMutation,useQuery } from '@tanstack/react-query'

import {
  deleteCurrentUser,
  fetchCurrentUser,
  initializeUser,
  updateCurrentUser,
} from '@/ui/service/api'

export const CURRENT_USER_QUERY_KEY = ['user', 'me'] as const

export function useGetCurrentUserQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    enabled,
    retry: false,
  })
}

export function useInitializeUserMutation() {
  return useMutation({
    mutationFn: () => initializeUser(),
  })
}

export function useUpdateCurrentUserMutation() {
  return useMutation({
    mutationFn: (data: { name?: string }) => updateCurrentUser(data),
  })
}

export function useDeleteCurrentUserMutation() {
  return useMutation({
    mutationFn: () => deleteCurrentUser(),
  })
}
