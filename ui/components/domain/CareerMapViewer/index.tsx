"use client"

import { useMemo, useState } from "react"
import { RxCross2 } from "react-icons/rx"

import type { CareerMap } from "@/core/domain"
import Spinner from "@/ui/components/basic/Spinner"
import { useCareerEventsByCareerMapIdQuery } from "@/ui/hooks/careerEvent"
import { useCareerMapQuery } from "@/ui/hooks/careerMap"

import CareerMapViewCanvas from "../CarrerMapEditor/CareerMapViewCanvas"
import { CarrerMapEditorContext } from "../CarrerMapEditor/hooks/CarrerMapEditorContext"
import type { CarrerMapEditorState } from "../CarrerMapEditor/hooks/useCarrerMapEditor"
import CarrerMapToolBar from "../CarrerMapEditor/CarrerMapToolBar"
import { DEFAULT_TIMELINE_CONFIG, SCALE_DEFAULT, SCALE_MONTH_WIDTH_PX } from "../CarrerMapEditor/utils/constants"
import { computeTimelineConfig } from "../CarrerMapEditor/utils/timelineMapping"

type CareerMapViewerProps = {
  careerMapId: string
  onClose?: () => void
}

export default function CareerMapViewer({ careerMapId, onClose }: CareerMapViewerProps) {
  const careerMapQuery = useCareerMapQuery(careerMapId)
  const careerEventsQuery = useCareerEventsByCareerMapIdQuery(careerMapId)
  const [scale, setScale] = useState(SCALE_DEFAULT)

  const careerMap = careerMapQuery.data
  const events = useMemo(() => careerEventsQuery.data?.items ?? [], [careerEventsQuery.data])

  const timelineConfig = useMemo(() => {
    if (!careerMap?.startDate) return DEFAULT_TIMELINE_CONFIG
    const config = computeTimelineConfig(
      careerMap as CareerMap & { startDate: string },
      events,
    )
    const monthWidthPx = SCALE_MONTH_WIDTH_PX[scale - 1]
    return { ...config, monthWidthInUnits: monthWidthPx / config.unit }
  }, [careerMap, events, scale])

  const isLoading = careerMapQuery.isLoading || careerEventsQuery.isLoading

  // CarrerMapToolBar は scale/setScale のみ使うため最小限の値だけ提供
  const viewerContextValue = { scale, setScale } as unknown as CarrerMapEditorState

  return (
    <CarrerMapEditorContext.Provider value={viewerContextValue}>
      <div className="flex flex-col w-full h-full">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 bg-background shrink-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 hover:bg-foreground/10 transition-colors"
              aria-label="閉じる"
            >
              <RxCross2 size={20} />
            </button>
          )}
          <h2 className="text-sm font-semibold text-foreground/70">キャリアマップを閲覧中</h2>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <Spinner />
            </div>
          ) : !careerMap?.startDate ? (
            <div className="flex items-center justify-center w-full h-full text-sm text-foreground/50">
              マップを表示できません
            </div>
          ) : (
            <>
              <CareerMapViewCanvas
                careerMap={careerMap as CareerMap & { startDate: string }}
                events={events}
                timelineConfig={timelineConfig}
                scale={scale}
              />
              <CarrerMapToolBar />
            </>
          )}
        </div>
      </div>
    </CarrerMapEditorContext.Provider>
  )
}
