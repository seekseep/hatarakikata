import type { CreateCreditTransactionCommand } from '@/core/application/port/command'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const createCreditTransactionCommand: CreateCreditTransactionCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()

  const balanceChange = parameters.type === 'grant' ? parameters.amount : -parameters.amount

  const { error: txError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: parameters.userId,
      amount: balanceChange,
      type: parameters.type,
      operation: parameters.operation ?? null,
    })

  if (txError) return failAsExternalServiceError(txError.message, txError)

  const { data: current } = await supabase
    .from('credit_balances')
    .select('balance')
    .eq('user_id', parameters.userId)
    .maybeSingle()

  const newBalance = Math.max(0, (current?.balance ?? 0) + balanceChange)

  const { error: balError } = current
    ? await supabase.from('credit_balances').update({ balance: newBalance }).eq('user_id', parameters.userId)
    : await supabase.from('credit_balances').insert({ user_id: parameters.userId, balance: newBalance })

  if (balError) return failAsExternalServiceError(balError.message, balError)

  return succeed(undefined)
}
