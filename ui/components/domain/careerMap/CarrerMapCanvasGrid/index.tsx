import clsx from "clsx"
import { memo } from "react"

import { SCALE_DISPLAY_CONFIG } from "../utils/constants"
import { buildTimelineConfig, computeCanvasWidth } from "../utils/timelineMapping"

type Props = {
  startDate: string
  endDate: string
  scale: number
  canvasHeight: number
}

export default memo(function CarrerMapCanvasGrid({ startDate, endDate, scale, canvasHeight }: Props) {
  const config = buildTimelineConfig(startDate, endDate, scale)

  const canvasWidth = computeCanvasWidth(config)
  const monthPx = config.monthWidthInUnits * config.unit
  const totalMonths = Math.ceil(canvasWidth / monthPx)
  const headerHeight = config.headerHeightInUnits * config.unit
  const { tickMonths, groupMonths } = SCALE_DISPLAY_CONFIG[scale - 1]

  const verticalLines: Array<{ left: number; isGroup: boolean }> = []
  for (let m = tickMonths; m < totalMonths; m += tickMonths) {
    verticalLines.push({
      left: m * monthPx,
      isGroup: m % groupMonths === 0,
    })
  }

  const lineHeight = canvasHeight - headerHeight

  return (
    <>
      {verticalLines.map((line) => (
        <div
          key={line.left}
          className={clsx(
            "absolute border-l",
            line.isGroup ? "border-foreground/10" : "border-foreground/5"
          )}
          style={{
            left: line.left,
            top: headerHeight,
            height: lineHeight,
          }}
        />
      ))}
    </>
  )
})
