import type { CareerEvent, CareerMap } from "@/core/domain"

import type { TimelineConfig } from "./constants"
import { DEFAULT_TIMELINE_CONFIG, SCALE_DISPLAY_CONFIG, SCALE_MONTH_WIDTH_PX } from "./constants"

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

const QUARTER_DAYS = [1, 8, 15, 22] as const

/** 日付を月の1/4区切り（1, 8, 15, 22日）に切り捨てる */
export function snapToQuarterMonth(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate()
  const snapped = QUARTER_DAYS.findLast((q) => q <= day) ?? 1
  const y = String(d.getFullYear()).padStart(4, "0")
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(snapped).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

export function dateToX(date: string, config: TimelineConfig): number {
  const origin = new Date(config.originDate)
  const target = new Date(date)
  const monthsDiff =
    (target.getFullYear() - origin.getFullYear()) * 12 +
    (target.getMonth() - origin.getMonth()) +
    (target.getDate() - 1) / daysInMonth(target.getFullYear(), target.getMonth())
  return monthsDiff * config.monthWidthInUnits * config.unit
}

export function xToDate(x: number, config: TimelineConfig): string {
  const monthsDiff = x / (config.monthWidthInUnits * config.unit)

  const origin = new Date(config.originDate)
  const totalMonths = origin.getFullYear() * 12 + origin.getMonth() + monthsDiff
  const year = Math.floor(totalMonths / 12)
  const month = Math.floor(totalMonths % 12)
  const fractionalMonth = totalMonths - (year * 12 + month)
  const day = Math.max(1, Math.round(fractionalMonth * daysInMonth(year, month)) + 1)
  const clampedDay = Math.min(day, daysInMonth(year, month))

  const y = String(year).padStart(4, "0")
  const m = String(month + 1).padStart(2, "0")
  const d = String(clampedDay).padStart(2, "0")
  return snapToQuarterMonth(`${y}-${m}-${d}`)
}

export type Rect = { x: number; y: number; width: number; height: number }

export function eventToRect(event: CareerEvent, config: TimelineConfig): Rect {
  const x = dateToX(event.startDate, config)
  const endX = dateToX(event.endDate, config)
  const width = Math.max(endX - x, config.unit)

  const row = event.row ?? 0
  const rowHeight = config.rowHeightInUnits * config.unit
  const rowGapHeight = config.rowGapHeightInUnits * config.unit
  const rowStep = rowHeight + rowGapHeight
  const headerPx = config.headerHeightInUnits * config.unit
  const y = headerPx + rowGapHeight + row * rowStep

  const strength = event.strength ?? 3
  const height = strength * rowHeight + (strength - 1) * rowGapHeight

  return { x, y, width, height }
}

export function questionToRect(question: { startDate: string; endDate: string; row?: number }, config: TimelineConfig): Rect {
  const x = dateToX(question.startDate, config)
  const endX = dateToX(question.endDate, config)
  const width = Math.max(endX - x, config.unit)

  const row = question.row ?? 0
  const rowHeight = config.rowHeightInUnits * config.unit
  const rowGapHeight = config.rowGapHeightInUnits * config.unit
  const rowStep = rowHeight + rowGapHeight
  const headerPx = config.headerHeightInUnits * config.unit
  const y = headerPx + rowGapHeight + row * rowStep

  return { x, y, width, height: rowHeight }
}

export function computeCanvasWidth(config: TimelineConfig): number {
  return dateToX(config.endDate, config) + config.monthWidthInUnits * config.unit
}

export function yToRow(y: number, config: TimelineConfig): number {
  const headerPx = config.headerHeightInUnits * config.unit
  const rowGapHeight = config.rowGapHeightInUnits * config.unit
  const rowStep = (config.rowHeightInUnits + config.rowGapHeightInUnits) * config.unit
  return Math.max(0, Math.floor((y - headerPx - rowGapHeight) / rowStep))
}

export function computeHeaderHeightInUnits(scale: number, rowHeightInUnits: number): number {
  const { tickMonths } = SCALE_DISPLAY_CONFIG[scale - 1]
  return tickMonths < 12 ? rowHeightInUnits * 2 : rowHeightInUnits
}

export function buildTimelineConfig(startDate: string, endDate: string, scale: number): TimelineConfig {
  const originYear = startDate.slice(0, 4)
  const monthWidthPx = SCALE_MONTH_WIDTH_PX[scale - 1]
  return {
    ...DEFAULT_TIMELINE_CONFIG,
    monthWidthInUnits: monthWidthPx / DEFAULT_TIMELINE_CONFIG.unit,
    originDate: `${originYear}-01-01`,
    endDate,
    headerHeightInUnits: computeHeaderHeightInUnits(scale, DEFAULT_TIMELINE_CONFIG.rowHeightInUnits),
  }
}

export function computeTimelineConfig(careerMap: CareerMap & { startDate: string }, _events: CareerEvent[]): TimelineConfig {
  const originYear = careerMap.startDate.slice(0, 4)
  return {
    ...DEFAULT_TIMELINE_CONFIG,
    originDate: `${originYear}-01-01`,
    endDate: careerMap.endDate,
  }
}
