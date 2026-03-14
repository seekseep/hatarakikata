import type { GetCreditBalanceQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const getCreditBalanceQuery: GetCreditBalanceQuery = async ({ userId }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('credit_balances')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) return failAsExternalServiceError(error.message, error)
  if (!data) return succeed(0)

  return succeed(data.balance)
}
