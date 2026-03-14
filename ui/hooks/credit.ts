'use client'

import { useQuery } from '@tanstack/react-query'

import { fetchCreditBalance, fetchCreditTransactions } from '@/ui/service/api'

export const CREDIT_BALANCE_QUERY_KEY = ['credit', 'balance'] as const
export const CREDIT_TRANSACTIONS_QUERY_KEY = ['credit', 'transactions'] as const

export function useGetCreditBalanceQuery() {
  return useQuery({
    queryKey: CREDIT_BALANCE_QUERY_KEY,
    queryFn: fetchCreditBalance,
  })
}

export function useListCreditTransactionsQuery() {
  return useQuery({
    queryKey: CREDIT_TRANSACTIONS_QUERY_KEY,
    queryFn: fetchCreditTransactions,
  })
}
