"use client"

import { useMemo } from "react"
import { RxCross2 } from "react-icons/rx"

import Spinner from "@/ui/components/basic/Spinner"
import { useCarrerMapSummariesQuery, useSimilarCareerMapsQuery } from "@/ui/hooks/careerMap"

import { openViewer } from "../../actions/dialogActions"
import { useCarrerMapEditorContext } from "../../hooks/CarrerMapEditorContext"

export default function CareerMapSearchDrawer({ onClose }: { onClose: () => void }) {
  const { state: { careerMapId, mode }, dispatch } = useCarrerMapEditorContext()
  const isOpen = mode.type === 'search-drawer'
  const similarQuery = useSimilarCareerMapsQuery(careerMapId, isOpen)

  const items = useMemo(() => similarQuery.data?.items ?? [], [similarQuery.data])
  const hasResults = items.length > 0
  const shouldShowList = !similarQuery.isLoading && (similarQuery.isError || !hasResults)

  const summariesQuery = useCarrerMapSummariesQuery(isOpen && shouldShowList)
  const otherItems = useMemo(() => summariesQuery.data?.items ?? [], [summariesQuery.data])

  const handleOpenViewer = (id: string, userName?: string) => {
    dispatch(openViewer(id, userName ?? undefined))
  }

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
        <div className="text-center">
          <h2 className="text-lg font-bold">似ているマップを検索</h2>
          <p className="text-xs text-foreground/60">タグ × 強さで類似度を計算しています</p>
        </div>
        <div className="w-7" />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {similarQuery.isLoading && (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          )}

          {hasResults && (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="rounded-lg border border-foreground/10 px-4 py-3 text-left hover:bg-foreground/5 transition-colors cursor-pointer w-full"
                  onClick={() => handleOpenViewer(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground/80">
                      Map ID: {item.id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-foreground/70">
                      類似度: {(item.score * 100).toFixed(1)}%
                    </div>
                  </div>
                  {item.overlapTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.overlapTags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-foreground/5 px-2 py-1 text-xs text-foreground/70"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {shouldShowList && (
            <div className="flex flex-col gap-3">
              {similarQuery.isError && (
                <p className="text-sm text-red-600">{String(similarQuery.error)}</p>
              )}

              {!similarQuery.isError && (
                <p className="text-sm text-foreground/60">似ているマップが見つかりませんでした。</p>
              )}

              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-foreground/80">他の人のマップ</p>

                {summariesQuery.isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Spinner />
                  </div>
                )}

                {summariesQuery.isError && (
                  <p className="text-sm text-red-600">{String(summariesQuery.error)}</p>
                )}

                {!summariesQuery.isLoading && !summariesQuery.isError && otherItems.length === 0 && (
                  <p className="text-sm text-foreground/60">他のマップが見つかりませんでした。</p>
                )}

                {otherItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="rounded-lg border border-foreground/10 px-4 py-3 text-left hover:bg-foreground/5 transition-colors cursor-pointer w-full"
                    onClick={() => handleOpenViewer(item.id, item.userName ?? undefined)}
                  >
                    <div className="text-sm font-semibold text-foreground/80">
                      {item.userName ?? "名無し"}
                    </div>
                    {item.startDate && (
                      <div className="text-xs text-foreground/50 mt-0.5">
                        {item.startDate} 〜
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
