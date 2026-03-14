"use client"

import { useEffect, useRef } from "react"

import { CREDIT_COSTS } from "@/core/application/config/creditCosts"
import Button from "@/ui/components/basic/Button"
import Dialog from "@/ui/components/basic/dialog/Dialog"
import Spinner from "@/ui/components/basic/Spinner"
import { useCreateCareerGuideMutation, useMyCareerGuidesQuery } from "@/ui/hooks/careerGuide"
import { useGetCurrentUserQuery } from "@/ui/hooks/user"

type CareerGuideCreatingDialogProps = {
  open: boolean
  baseCareerMapId: string
  guideCareerMapId: string
  onClose: () => void
  onCreated: (guideId: string) => void
}

export default function CareerGuideCreatingDialog({
  open,
  baseCareerMapId,
  guideCareerMapId,
  onClose,
  onCreated,
}: CareerGuideCreatingDialogProps) {
  const { data: currentUser } = useGetCurrentUserQuery()
  const isFree = currentUser?.membership.plan === 'free'
  const balance = currentUser?.balance ?? 0
  const cost = CREDIT_COSTS.generateCareerGuide
  const hasInsufficientCredits = isFree && balance < cost

  const createMutation = useCreateCareerGuideMutation()
  const careerGuidesQuery = useMyCareerGuidesQuery()
  const hasStarted = useRef(false)

  useEffect(() => {
    if (open && !hasStarted.current && !hasInsufficientCredits) {
      hasStarted.current = true
      createMutation.mutate(
        { baseCareerMapId, guideCareerMapId },
        {
          onSuccess: (data) => {
            careerGuidesQuery.refetch()
            onCreated(data.id)
          },
        },
      )
    }
    if (!open) {
      hasStarted.current = false
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onClose={() => {}} className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-4 py-4">
        {hasInsufficientCredits && (
          <>
            <p className="text-sm text-red-600">
              クレジットが不足しています（残高: {balance} / 必要: {cost}）
            </p>
            <Button type="button" variant="ghost" size="medium" onClick={onClose}>
              閉じる
            </Button>
          </>
        )}
        {!hasInsufficientCredits && createMutation.isPending && (
          <>
            <Spinner />
            <p className="text-sm text-foreground/70">ガイドを作成中...</p>
            {isFree && (
              <p className="text-xs text-foreground/50">
                残高: {balance} クレジット（この操作で {cost} 消費）
              </p>
            )}
          </>
        )}
        {createMutation.isError && (
          <>
            <p className="text-sm text-red-600">
              ガイドの作成に失敗しました。
            </p>
            <Button type="button" variant="ghost" size="medium" onClick={onClose}>
              閉じる
            </Button>
          </>
        )}
      </div>
    </Dialog>
  )
}
