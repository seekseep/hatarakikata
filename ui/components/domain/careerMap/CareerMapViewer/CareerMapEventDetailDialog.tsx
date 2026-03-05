"use client"

import clsx from "clsx"
import { RiCloseLine } from "react-icons/ri"

import type { CareerEvent } from "@/core/domain"
import Dialog from "@/ui/components/basic/dialog/Dialog"
import {
  EVENT_TYPE_SHORT_LABEL_FEELING,
  EVENT_TYPE_SHORT_LABEL_LIVING,
  EVENT_TYPE_SHORT_LABEL_WORKING,
} from "@/ui/constants"

type Props = {
  event: CareerEvent | null
  onClose: () => void
}

export default function CareerMapEventDetailDialog({ event, onClose }: Props) {
  if (!event) return null

  const title = event.name
  const dateRange = `${event.startDate} 〜 ${event.endDate}`

  return (
    <Dialog open={!!event} onClose={onClose} className="w-full max-w-md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
            aria-label="閉じる"
          >
            <RiCloseLine size={20} />
          </button>
          <div className="flex gap-3">
            <div className="flex items-end gap-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={clsx(
                    "w-2 rounded-sm",
                    { 1: "h-2", 2: "h-3", 3: "h-4", 4: "h-5", 5: "h-6" }[level],
                    level <= (event.strength ?? 3)
                      ? {
                          working: "bg-blue-400",
                          living: "bg-green-400",
                          feeling: "bg-amber-400",
                        }[event.type ?? "working"]
                      : "bg-foreground/15"
                  )}
                />
              ))}
            </div>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${{
              working: "bg-blue-100 border-blue-400 text-blue-800",
              living: "bg-green-100 border-green-400 text-green-800",
              feeling: "bg-amber-100 border-amber-400 text-amber-800",
            }[event.type ?? "working"]}`}>
              {{ working: EVENT_TYPE_SHORT_LABEL_WORKING, living: EVENT_TYPE_SHORT_LABEL_LIVING, feeling: EVENT_TYPE_SHORT_LABEL_FEELING }[event.type ?? "working"]}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-1">
            {title}
          </h2>
          <p className="text-sm mb-2 text-foreground/50">
            {dateRange}
          </p>
          {event.description && (
            <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {event.tags.length > 0 && (
            <div className="flex gap-3">
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
        </div>
      </div>
    </Dialog>
  )
}
