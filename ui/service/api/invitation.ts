import { apiFetch } from './client'

export function redeemInvitation(code: string): Promise<void> {
  return apiFetch<void>('/api/me/membership/redeem', {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
}
