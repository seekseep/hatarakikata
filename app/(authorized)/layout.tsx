'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { type ReactNode,useEffect, useRef } from 'react'

import Spinner from '@/ui/components/basic/Spinner'
import { CURRENT_USER_QUERY_KEY,useGetCurrentUserQuery, useInitializeUserMutation } from '@/ui/hooks/user'
import { useAuth } from '@/ui/providers/AuthProvider'
import { ApiError } from '@/ui/service/api/client'

export default function AuthorizedLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user: authUser, isLoading: isAuthLoading, isError: isAuthError } = useAuth()
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useGetCurrentUserQuery(!!authUser && !isAuthLoading)

  const initMutation = useInitializeUserMutation()
  const initCalledRef = useRef(false)

  const isNotInitialized = userError instanceof ApiError && userError.status === 404

  useEffect(() => {
    if (isAuthLoading) return
    if (!authUser || isAuthError) {
      router.push('/login')
      return
    }
    if (isUserLoading) return
    if (isNotInitialized && !initCalledRef.current) {
      initCalledRef.current = true
      initMutation.mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY })
        },
      })
    }
  }, [authUser, isAuthLoading, isAuthError, isUserLoading, isNotInitialized, initMutation, queryClient, router])

  if (isAuthLoading || (!!authUser && (isUserLoading || isNotInitialized))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!authUser || !currentUser) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}
