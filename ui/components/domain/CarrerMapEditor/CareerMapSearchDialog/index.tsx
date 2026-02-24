"use client"

import { useMemo } from "react"
import { RxCross2 } from "react-icons/rx"

import Dialog from "@/ui/components/basic/dialog/Dialog"
import Spinner from "@/ui/components/basic/Spinner"
import { useSimilarCareerMapsQuery } from "@/ui/hooks/careerMap"

import { useCarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"

export default function CareerMapSearchDialog() {
  const { careerMapId, searchDialogOpen, closeSearchDialog, openViewer } = useCarrerMapEditorContext()
  const similarQuery = useSimilarCareerMapsQuery(careerMapId, searchDialogOpen)

  const items = useMemo(() => similarQuery.data?.items ?? [], [similarQuery.data])
  const hasResults = items.length > 0

  const handleOpenViewer = (id: string) => {
    closeSearchDialog()
    openViewer(id)
  }

  return (
    <Dialog open={searchDialogOpen} onClose={closeSearchDialog} className="w-full max-w-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={closeSearchDialog}
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

        {similarQuery.isLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {similarQuery.isError && (
          <p className="text-sm text-red-600">{String(similarQuery.error)}</p>
        )}

        {!similarQuery.isLoading && !hasResults && !similarQuery.isError && (
          <p className="text-sm text-foreground/60">似ているマップが見つかりませんでした。</p>
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
      </div>
    </Dialog>
  )
}
