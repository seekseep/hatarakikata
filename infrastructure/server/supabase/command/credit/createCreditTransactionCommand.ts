import type { CreateCreditTransactionCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const createCreditTransactionCommand: CreateCreditTransactionCommand = async (params) => {
  const supabase = createSupabaseAdmin()

  const balanceChange = params.type === 'grant' ? params.amount : -params.amount

  const { error: txError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: params.userId,
      amount: balanceChange,
      type: params.type,
      operation: params.operation ?? null,
    })

  if (txError) return failAsExternalServiceError(txError.message, txError)

  const { data: current } = await supabase
    .from('credit_balances')
    .select('balance')
    .eq('user_id', params.userId)
    .maybeSingle()

  const newBalance = Math.max(0, (current?.balance ?? 0) + balanceChange)

  const { error: balError } = current
    ? await supabase.from('credit_balances').update({ balance: newBalance }).eq('user_id', params.userId)
    : await supabase.from('credit_balances').insert({ user_id: params.userId, balance: newBalance })

  if (balError) return failAsExternalServiceError(balError.message, balError)

  return succeed(undefined)
}
