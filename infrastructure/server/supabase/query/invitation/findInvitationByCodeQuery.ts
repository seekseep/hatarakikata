import type { FindInvitationByCodeQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const findInvitationByCodeQuery: FindInvitationByCodeQuery = async ({ code }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('invitation_codes')
    .select('id, code, used_at')
    .eq('code', code)
    .maybeSingle()

  if (error) return failAsExternalServiceError(error.message, error)
  if (!data) return succeed(null)

  return succeed({
    id: data.id,
    code: data.code,
    usedAt: data.used_at,
  })
}
