import type { FindUserQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { userRowWithCreditAndMembershipToEntity } from '../../converter'

export const findUserQuery: FindUserQuery = async ({ id }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('users')
    .select('id, name, credit_balances(balance), memberships(plan)')
    .eq('id', id)
    .maybeSingle()

  if (error) return failAsExternalServiceError(error.message, error)
  if (!data) return succeed(null)

  return succeed(userRowWithCreditAndMembershipToEntity(data))
}
