import { tv } from "tailwind-variants"

import type { ScaleDisplayConfig, TimelineConfig } from "./types"

export type { ScaleDisplayConfig, TimelineConfig } from "./types"

export const DEFAULT_TIMELINE_CONFIG: TimelineConfig = {
  unit: 24,
  monthWidthInUnits: 4,
  originDate: "2020-01-01",
  endDate: new Date().toISOString().split("T")[0],
  rowHeightInUnits: 1.2,
  rowGapHeightInUnits: 0.3,
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
  { snapMonths: 0.25, tickMonths: 1,  groupMonths: 3,   tickWidthPx: 100 },
  // scale 2: 2年表示, 目盛り=四半期(150px), グループ=半期
  { snapMonths: 1,    tickMonths: 3,  groupMonths: 6,   tickWidthPx: 150 },
  // scale 3: 5年表示, 目盛り=半期(120px), グループ=年
  { snapMonths: 1,    tickMonths: 6,  groupMonths: 12,  tickWidthPx: 120 },
  // scale 4: 10年表示, 目盛り=年(120px), グループ=5年
  { snapMonths: 3,    tickMonths: 12, groupMonths: 60,  tickWidthPx: 120 },
  // scale 5: 20年表示, 目盛り=5年(300px), グループ=10年
  { snapMonths: 6,    tickMonths: 60, groupMonths: 120, tickWidthPx: 300 },
  // scale 6: 40年表示, 目盛り=5年(150px), グループ=10年
  { snapMonths: 12,   tickMonths: 60, groupMonths: 120, tickWidthPx: 150 },
]

/** 導出: 1月あたりのpx幅 */
export const SCALE_MONTH_WIDTH_PX = SCALE_DISPLAY_CONFIG.map(c => c.tickWidthPx / c.tickMonths)

// イベントタイプ × 強さ別の色クラス (tailwind-variants)
export const eventItemColors = tv({
  base: "",
  variants: {
    eventType: {
      working: "",
      living: "",
      feeling: "",
    },
    strength: {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
    },
  },
  compoundVariants: [
    { eventType: "working", strength: 1, class: "bg-blue-100 border-blue-300" },
    { eventType: "working", strength: 2, class: "bg-blue-200 border-blue-400" },
    { eventType: "working", strength: 3, class: "bg-blue-300 border-blue-500" },
    { eventType: "working", strength: 4, class: "bg-blue-400 border-blue-600" },
    { eventType: "working", strength: 5, class: "bg-blue-500 border-blue-700" },
    { eventType: "living",  strength: 1, class: "bg-green-100 border-green-300" },
    { eventType: "living",  strength: 2, class: "bg-green-200 border-green-400" },
    { eventType: "living",  strength: 3, class: "bg-green-300 border-green-500" },
    { eventType: "living",  strength: 4, class: "bg-green-400 border-green-600" },
    { eventType: "living",  strength: 5, class: "bg-green-500 border-green-700" },
    { eventType: "feeling", strength: 1, class: "bg-amber-100 border-amber-300" },
    { eventType: "feeling", strength: 2, class: "bg-amber-200 border-amber-400" },
    { eventType: "feeling", strength: 3, class: "bg-amber-300 border-amber-500" },
    { eventType: "feeling", strength: 4, class: "bg-amber-400 border-amber-600" },
    { eventType: "feeling", strength: 5, class: "bg-amber-500 border-amber-700" },
  ],
  defaultVariants: {
    eventType: "working",
    strength: 3,
  },
})
