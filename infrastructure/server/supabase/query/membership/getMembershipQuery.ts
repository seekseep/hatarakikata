import type { GetMembershipQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const getMembershipQuery: GetMembershipQuery = async ({ userId }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('memberships')
    .select('user_id, plan')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) return failAsExternalServiceError(error.message, error)
  if (!data) return succeed({ userId, plan: 'free' as const })

  return succeed({ userId: data.user_id, plan: data.plan as 'free' | 'premium' })
}
