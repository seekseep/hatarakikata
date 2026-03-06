import { memo } from "react"

import { SCALE_DISPLAY_CONFIG } from "../utils/constants"
import { buildTimelineConfig, computeCanvasWidth } from "../utils/timelineMapping"

type Props = {
  startDate: string
  endDate: string
  scale: number
}

type YearSegment = {
  left: number
  width: number
  year: number
  age: number
}

type MonthTick = {
  left: number
  width: number
  month: number
}

export default memo(function CarrerMapCanvasRuler({ startDate, endDate, scale }: Props) {
  const config = buildTimelineConfig(startDate, endDate, scale)
  const { tickMonths } = SCALE_DISPLAY_CONFIG[scale - 1]

  const canvasWidth = computeCanvasWidth(config)
  const monthPx = config.monthWidthInUnits * config.unit
  const totalMonths = Math.ceil(canvasWidth / monthPx)

  const originDate = new Date(config.originDate)
  const originYear = originDate.getFullYear()
  const originMonth = originDate.getMonth()
  const birthYear = new Date(startDate).getFullYear()

  const hasMonths = tickMonths < 12
  const headerHeight = config.headerHeightInUnits * config.unit
  const rowHeight = headerHeight / (hasMonths ? 2 : 1)

  // 年セグメント: hasMonths=true → 1年ずつ, false → tickMonths ずつ
  const yearSegments: YearSegment[] = []
  {
    const step = hasMonths ? 12 : tickMonths
    for (let m = 0; m < totalMonths; m += step) {
      const span = Math.min(step, totalMonths - m)
      const date = new Date(originYear, originMonth + m, 1)
      const year = date.getFullYear()
      yearSegments.push({
        left: m * monthPx,
        width: span * monthPx,
        year,
        age: year - birthYear,
      })
    }
  }

  // 月目盛り: hasMonths=true のときのみ
  const monthTicks: MonthTick[] = []
  if (hasMonths) {
    for (let m = 0; m < totalMonths; m += tickMonths) {
      const span = Math.min(tickMonths, totalMonths - m)
      const date = new Date(originYear, originMonth + m, 1)
      monthTicks.push({
        left: m * monthPx,
        width: span * monthPx,
        month: date.getMonth(),
      })
    }
  }

  return (
    <div
      className="sticky top-0 z-10 border-b border-foreground/10 bg-background"
      style={{ height: headerHeight }}
    >
      {/* 年行 */}
      <div className="flex" style={{ height: rowHeight }}>
        {yearSegments.map((seg, i) => (
          <div
            key={i}
            className="shrink-0 flex items-center border-l border-foreground/10 first:border-l-0"
            style={{ width: seg.width }}
          >
            <span className="sticky left-0 z-10 text-xs text-foreground/50 px-1 font-bold bg-background whitespace-nowrap">
              {seg.age}歳 {seg.year}年
            </span>
          </div>
        ))}
      </div>

      {/* 月行 (hasMonths のときのみ) */}
      {hasMonths && (
        <div className="flex border-t border-foreground/5" style={{ height: rowHeight }}>
          {monthTicks.map((tick, i) => (
            <div
              key={i}
              className="shrink-0 border-l border-foreground/10 px-1 flex items-center first:border-l-0"
              style={{ width: tick.width }}
            >
              <span className="text-xs text-foreground/50 leading-none whitespace-nowrap">
                {tick.month + 1}月
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
