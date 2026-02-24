export type TimelineConfig = {
  unit: number
  monthWidthInUnits: number
  originDate: string
  endDate: string
  rowHeightInUnits: number
  rowGapHeightInUnits: number
  headerHeightInUnits: number
  maxStrength: number
}

export type ScaleDisplayConfig = {
  /** ドラッグ時のスナップ単位（月数） */
  snapMonths: number
  /** 目盛りの単位（月数） */
  tickMonths: number
  /** 目盛りグループの単位（月数） */
  groupMonths: number
  /** 目盛り1つ分の幅（px） */
  tickWidthPx: number
}
