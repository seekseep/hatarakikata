export const typeOptions = [
  { value: "working", label: "学校と仕事", shortLabel: "仕事" },
  { value: "living", label: "生活の出来事", shortLabel: "生活" },
  { value: "feeling", label: "感じたこと", shortLabel: "気持ち" },
]

export const typeLabel: Record<string, string> = Object.fromEntries(
  typeOptions.map(({ value, shortLabel }) => [value, shortLabel])
)

export const strengthLabel = ["", "とても弱い", "弱い", "普通", "強い", "とても強い"] as const
