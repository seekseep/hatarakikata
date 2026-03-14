'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import Breadcrumb from '@/ui/components/basic/Breadcrumb'
import InvitationCodeForm from '@/ui/components/domain/invitation/InvitationCodeForm'
import { CURRENT_USER_QUERY_KEY, useGetCurrentUserQuery } from '@/ui/hooks/user'

export default function MePlanPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: currentUser } = useGetCurrentUserQuery()

  const isFree = currentUser?.membership.plan === 'free'

  return (
    <>
      <Breadcrumb items={[
        { label: 'ホーム', href: '/' },
        { label: 'マイページ', href: '/me' },
        { label: 'プラン' },
      ]} />

      <div className="text-2xl py-4">
        プラン
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/70">現在のプラン:</span>
          <span className="font-medium">
            {isFree ? 'フリー' : 'プレミアム'}
          </span>
        </div>

        {isFree && (
          <>
            <InvitationCodeForm onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY })
              router.push('/me')
            }} />
          </>
        )}
      </div>
    </>
  )
}
