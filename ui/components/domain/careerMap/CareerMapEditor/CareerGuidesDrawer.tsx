"use client"

import { useMemo } from "react"
import { RxCross2 } from "react-icons/rx"

import Spinner from "@/ui/components/basic/Spinner"
import { useMyCareerGuidesQuery } from "@/ui/hooks/careerGuide"

import { openCareerGuideDetailDrawer } from "../actions/dialogActions"
import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"

export default function CareerGuidesDrawer({ onClose }: { onClose: () => void }) {
  const { dispatch } = useCarrerMapEditorContext()
  const careerGuidesQuery = useMyCareerGuidesQuery()
  const guides = useMemo(() => careerGuidesQuery.data ?? [], [careerGuidesQuery.data])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
          aria-label="閉じる"
        >
          <RxCross2 size={20} />
        </button>
        <h2 className="text-lg font-bold">ガイド一覧</h2>
        <div className="w-7" />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {careerGuidesQuery.isLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {!careerGuidesQuery.isLoading && guides.length === 0 && (
          <p className="text-sm text-foreground/60 text-center py-8">ガイドはまだありません</p>
        )}

        <div className="flex flex-col gap-3">
          {guides.map((guide) => (
            <button
              key={guide.id}
              type="button"
              className="rounded-lg border border-foreground/10 px-4 py-3 text-left hover:bg-foreground/5 transition-colors cursor-pointer w-full"
              onClick={() => dispatch(openCareerGuideDetailDrawer(guide.id))}
            >
              <div className="text-sm font-semibold text-foreground/80">
                {new Date(guide.createdAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-xs text-foreground/50 mt-1">
                {guide.sourceUserName ?? "不明"} のキャリアをもとに作成
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
