'use client'

import Breadcrumb from '@/ui/components/basic/Breadcrumb'
import { useGetCreditBalanceQuery, useListCreditTransactionsQuery } from '@/ui/hooks/credit'

const operationLabels: Record<string, string> = {
  generateCareerEvents: 'キャリアイベント生成',
  generateCareerGuide: 'キャリアガイド作成',
}

export default function MeCreditPage() {
  const { data: balanceData } = useGetCreditBalanceQuery()
  const { data: transactions } = useListCreditTransactionsQuery()

  return (
    <>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: 'マイページ', href: '/me' },
        { label: 'クレジット' },
      ]} />

      <div className="text-2xl py-4">
        クレジット
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/70">残高:</span>
          <span className="text-xl font-bold">{balanceData?.balance ?? 0}</span>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground/70 mb-3">取引履歴</h3>
          {transactions && transactions.length > 0 ? (
            <div className="divide-y divide-foreground/10">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium">
                      {tx.type === 'grant' ? '付与' : '消費'}
                      {tx.operation && (
                        <span className="text-foreground/50 ml-1">({operationLabels[tx.operation] ?? tx.operation})</span>
                      )}
                    </div>
                    <div className="text-xs text-foreground/50">
                      {new Date(tx.createdAt).toLocaleString('ja-JP')}
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === 'grant' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'grant' ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/50">取引履歴はありません</p>
          )}
        </div>
      </div>
    </>
  )
}
