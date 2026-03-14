import type { CreditTransaction } from '@/core/application/port/query/credit/listCreditTransactionsQuery'

import { apiFetch } from './client'

export function fetchCreditBalance(): Promise<{ balance: number }> {
  return apiFetch<{ balance: number }>('/api/me/credits')
}

export function fetchCreditTransactions(): Promise<CreditTransaction[]> {
  return apiFetch<CreditTransaction[]>('/api/me/credits/transactions')
}
