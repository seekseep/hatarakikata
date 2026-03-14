'use client'

import { useMutation } from '@tanstack/react-query'

import { redeemInvitation } from '@/ui/service/api'

export function useRedeemInvitationMutation() {
  return useMutation({
    mutationFn: (code: string) => redeemInvitation(code),
  })
}
