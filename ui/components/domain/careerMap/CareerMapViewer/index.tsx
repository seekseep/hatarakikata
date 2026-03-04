"use client"

import { useMemo, useState } from "react"
import { RxCross2 } from "react-icons/rx"

import type { CareerEvent, CareerMap } from "@/core/domain"
import Spinner from "@/ui/components/basic/Spinner"
import { useCareerEventsByCareerMapIdQuery } from "@/ui/hooks/careerEvent"
import { useCareerMapQuery } from "@/ui/hooks/careerMap"

import CarrerMapToolBar from "../CarrerMapToolBar"
import { CarrerMapEditorContext } from "../hooks/CarrerMapEditorContext"
import type { CarrerMapEditorStore } from "../hooks/useCarrerMapEditor"
import { DEFAULT_TIMELINE_CONFIG, SCALE_DEFAULT, SCALE_MONTH_WIDTH_PX } from "../utils/constants"
import { computeHeaderHeightInUnits, computeTimelineConfig } from "../utils/timelineMapping"
import CareerMapEventDetailDialog from "./CareerMapEventDetailDialog"
import CareerMapViewCanvas from "./CareerMapViewCanvas"

type CareerMapViewerProps = {
  careerMapId: string
  userName?: string
  onClose?: () => void
  onCreateCareerGuide?: () => void
}

export default function CareerMapViewer({ careerMapId, userName, onClose, onCreateCareerGuide }: CareerMapViewerProps) {
  const careerMapQuery = useCareerMapQuery(careerMapId)
  const careerEventsQuery = useCareerEventsByCareerMapIdQuery(careerMapId)
  const [scale, setScale] = useState(SCALE_DEFAULT)
  const [selectedEvent, setSelectedEvent] = useState<CareerEvent | null>(null)

  const careerMap = careerMapQuery.data
  const events = useMemo(() => careerEventsQuery.data?.items ?? [], [careerEventsQuery.data])

  const timelineConfig = useMemo(() => {
    if (!careerMap?.startDate) return DEFAULT_TIMELINE_CONFIG
    const config = computeTimelineConfig(
      careerMap as CareerMap & { startDate: string },
      events,
    )
    const monthWidthPx = SCALE_MONTH_WIDTH_PX[scale - 1]
    return {
      ...config,
      monthWidthInUnits: monthWidthPx / config.unit,
      headerHeightInUnits: computeHeaderHeightInUnits(scale, config.rowHeightInUnits),
    }
  }, [careerMap, events, scale])

  const isLoading = careerMapQuery.isLoading || careerEventsQuery.isLoading

  // CarrerMapToolBar は state.scale / setScale のみ使うため最小限の値だけ提供
  const viewerContextValue = { state: { scale }, setScale } as unknown as CarrerMapEditorStore

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
          <h2 className="text-sm font-semibold text-foreground/70">{userName ?? "キャリアマップ"}</h2>
          <div className="flex-1" />
          {onCreateCareerGuide && (
            <button
              type="button"
              onClick={onCreateCareerGuide}
              className="text-xs px-3 py-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              ガイドを作成する
            </button>
          )}
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
                onEventClick={setSelectedEvent}
              />
              <CarrerMapToolBar />
            </>
          )}
        </div>
      </div>
      <CareerMapEventDetailDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </CarrerMapEditorContext.Provider>
  )
}
