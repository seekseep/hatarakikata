import type { UpdateMembershipCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const updateMembershipCommand: UpdateMembershipCommand = async ({ userId, plan }) => {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase
    .from('memberships')
    .upsert({ user_id: userId, plan }, { onConflict: 'user_id' })

  if (error) return failAsExternalServiceError(error.message, error)
  return succeed(undefined)
}
