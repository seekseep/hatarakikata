import type { CreateMembershipCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const createMembershipCommand: CreateMembershipCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase
    .from('memberships')
    .upsert(
      { user_id: parameters.userId, plan: parameters.plan },
      { onConflict: 'user_id' }
    )

  if (error) return failAsExternalServiceError(error.message, error)
  return succeed(undefined)
}
