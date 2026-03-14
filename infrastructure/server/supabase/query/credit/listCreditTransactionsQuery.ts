import type { ListCreditTransactionsQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const listCreditTransactionsQuery: ListCreditTransactionsQuery = async ({ userId }) => {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('id, amount, type, operation, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed(
    (data ?? []).map((row) => ({
      id: row.id,
      amount: row.amount,
      type: row.type as 'grant' | 'usage',
      operation: row.operation,
      createdAt: row.created_at,
    }))
  )
}
