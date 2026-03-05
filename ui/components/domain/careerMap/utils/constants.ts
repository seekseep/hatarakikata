import type { ScaleDisplayConfig, TimelineConfig } from "./types"

export type { ScaleDisplayConfig, TimelineConfig } from "./types"

export const DEFAULT_TIMELINE_CONFIG: TimelineConfig = {
  unit: 10,
  monthWidthInUnits: 4,
  originDate: "2020-01-01",
  endDate: new Date().toISOString().split("T")[0],
  rowHeightInUnits: 1,
  rowGapHeightInUnits: 2,
  headerHeightInUnits: 3,
  maxStrength: 5,
}

// スケール定義 — 画面幅1200pxを基準
// スケール1が最もズームイン(1年表示)、スケール6が最もズームアウト(40年表示)
//
// | スケール | 1画面の範囲 | メモリグループ | 最小メモリ | px/月  |
// |---------|-----------|-------------|---------|-------|
// | 1       | 1年       | 3ヶ月(四半期) | 1ヶ月    | 100   |
// | 2       | 2年       | 6ヶ月(半期)   | 3ヶ月    | 50    |
// | 3       | 5年       | 1年          | 6ヶ月    | 20    |
// | 4       | 10年      | 5年          | 1年      | 10    |
// | 5       | 20年      | 10年         | 5年      | 5     |
// | 6       | 40年      | 10年         | 5年      | 2.5   |

export const SCALE_MIN = 1
export const SCALE_MAX = 6
export const SCALE_DEFAULT = 4

export const SCALE_DISPLAY_CONFIG: ScaleDisplayConfig[] = [
  // scale 1: 1年表示, 目盛り=1ヶ月(100px), グループ=四半期
  { snapMonths: 0.25, tickMonths: 1,  groupMonths: 3,   tickWidthPx: 100, headerRows: 4 },
  // scale 2: 2年表示, 目盛り=四半期(150px), グループ=半期
  { snapMonths: 1,    tickMonths: 3,  groupMonths: 6,   tickWidthPx: 150, headerRows: 4 },
  // scale 3: 5年表示, 目盛り=半期(120px), グループ=年
  { snapMonths: 1,    tickMonths: 6,  groupMonths: 12,  tickWidthPx: 120, headerRows: 4 },
  // scale 4: 10年表示, 目盛り=年(120px), グループ=5年
  { snapMonths: 3,    tickMonths: 12, groupMonths: 60,  tickWidthPx: 120, headerRows: 2 },
  // scale 5: 20年表示, 目盛り=5年(300px), グループ=10年
  { snapMonths: 6,    tickMonths: 60, groupMonths: 120, tickWidthPx: 300, headerRows: 2 },
  // scale 6: 40年表示, 目盛り=5年(150px), グループ=10年
  { snapMonths: 12,   tickMonths: 60, groupMonths: 120, tickWidthPx: 150, headerRows: 2 },
]

/** 導出: 1月あたりのpx幅 */
export const SCALE_MONTH_WIDTH_PX = SCALE_DISPLAY_CONFIG.map(c => c.tickWidthPx / c.tickMonths)
