"use client"

import { RxCross2 } from "react-icons/rx"

import type { CareerEvent } from "@/core/domain"
import Dialog from "@/ui/components/basic/dialog/Dialog"

type Props = {
  event: CareerEvent | null
  onClose: () => void
}

const typeLabel: Record<string, string> = {
  working: "仕事",
  living: "生活",
  feeling: "気持ち",
}

const strengthLabel = ["", "とても弱い", "弱い", "普通", "強い", "とても強い"] as const

export default function CareerMapEventDetailDialog({ event, onClose }: Props) {
  if (!event) return null

  const isPoint = event.startDate === event.endDate
  const title = event.name ?? event.startName ?? ""
  const dateRange = isPoint ? event.startDate : `${event.startDate} 〜 ${event.endDate}`

  return (
    <Dialog open={!!event} onClose={onClose} className="w-full max-w-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
            aria-label="閉じる"
          >
            <RxCross2 size={20} />
          </button>
          <h2 className="text-base font-bold">{title}</h2>
          <div className="w-7" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <span className="text-xs text-foreground/50 w-14 shrink-0 pt-0.5">種別</span>
            <span className="text-xs">{typeLabel[event.type ?? "working"]}</span>
          </div>

          <div className="flex gap-3">
            <span className="text-xs text-foreground/50 w-14 shrink-0 pt-0.5">期間</span>
            <span className="text-xs">{dateRange}</span>
          </div>

          <div className="flex gap-3">
            <span className="text-xs text-foreground/50 w-14 shrink-0 pt-0.5">強さ</span>
            <span className="text-xs">{strengthLabel[event.strength ?? 3]}</span>
          </div>

          {event.tags.length > 0 && (
            <div className="flex gap-3">
              <span className="text-xs text-foreground/50 w-14 shrink-0 pt-0.5">タグ</span>
              <div className="flex flex-wrap gap-1">
                {event.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/70"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.description && (
            <div className="flex gap-3">
              <span className="text-xs text-foreground/50 w-14 shrink-0 pt-0.5">詳細</span>
              <span className="text-xs text-foreground/80 whitespace-pre-wrap">{event.description}</span>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
