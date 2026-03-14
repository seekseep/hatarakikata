import type { UpdateInvitationCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const updateInvitationCommand: UpdateInvitationCommand = async ({ invitationId }) => {
  const supabase = createSupabaseAdmin()

  const { error } = await supabase
    .from('invitation_codes')
    .update({ used_at: new Date().toISOString() })
    .eq('id', invitationId)

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed(undefined)
}
