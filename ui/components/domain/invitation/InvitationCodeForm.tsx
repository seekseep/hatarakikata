'use client'

import { useState } from 'react'

import Alert from '@/ui/components/basic/Alert'
import Button from '@/ui/components/basic/Button'
import { useRedeemInvitationMutation } from '@/ui/hooks/invitation'

type InvitationCodeFormProps = {
  onSuccess?: () => void
}

export default function InvitationCodeForm({ onSuccess }: InvitationCodeFormProps) {
  const [code, setCode] = useState('')
  const mutation = useRedeemInvitationMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed || mutation.isPending) return

    mutation.mutate(trimmed, {
      onSuccess: () => {
        setCode('')
        onSuccess?.()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="invitation-code" className="block text-sm font-medium mb-1">
          招待コード
        </label>
        <input
          id="invitation-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="招待コードを入力"
          className="w-full rounded-md border border-foreground/20 px-3 py-2 text-sm"
          disabled={mutation.isPending}
        />
      </div>

      {mutation.isSuccess && (
        <Alert variant="success">プレミアムプランにアップグレードしました</Alert>
      )}

      {mutation.isError && (
        <Alert variant="error">
          {mutation.error instanceof Error ? mutation.error.message : '招待コードが無効です'}
        </Alert>
      )}

      <Button
        type="submit"
        variant="primary"
        size="medium"
        disabled={mutation.isPending || !code.trim()}
      >
        {mutation.isPending ? '処理中...' : '適用'}
      </Button>
    </form>
  )
}
