import type { CareerEvent, GenerateCareerEventAction } from "@/core/domain"

function ensureDate(value: string | undefined, fallback: string): string {
  if (!value) return fallback
  if (value.length === 7) return `${value}-01`
  if (value.length >= 10) return value.slice(0, 10)
  return fallback
}

function escapeToonValue(value: string): string {
  if (value.includes(",") || value.includes("\n")) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function formatEvents(events: CareerEvent[]): string {
  if (events.length === 0) return "(イベントなし)"
  const header = `events[${events.length}]{id,name,type,startDate,endDate,strength,row,tags,description}:`
  const rows = events.map((e) => {
    const tags = e.tags?.length ? e.tags.map((t) => t.name).join(";") : ""
    const desc = e.description ? e.description.replace(/\s+/g, " ") : ""
    return `  ${e.id},${escapeToonValue(e.name)},${e.type ?? "working"},${e.startDate},${e.endDate},${e.strength},${e.row},${escapeToonValue(tags)},${escapeToonValue(desc)}`
  })
  return [header, ...rows].join("\n")
}

export function normalizeActions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any[],
  fallbackDate: string,
  tags: { id: string; name: string }[]
): GenerateCareerEventAction[] {
  const tagNameSet = new Set(tags.map((t) => t.name))
  const validTypes = ["living", "working", "feeling"] as const

  const normalizeTagNames = (rawTagNames: unknown): string[] => {
    if (!Array.isArray(rawTagNames)) return []
    return rawTagNames.filter((name): name is string => typeof name === "string" && tagNameSet.has(name))
  }

  return actions
    .filter((action) => action?.type === "create" || action?.type === "update")
    .map((action): GenerateCareerEventAction => {
      if (action.type === "create") {
        const e = action.payload ?? {}
        return {
          type: "create",
          payload: {
            name: e.name || e.startName || "新しいイベント",
            type: validTypes.includes(e.type) ? e.type : "working",
            startDate: ensureDate(e.startDate, fallbackDate),
            endDate: ensureDate(e.endDate, fallbackDate),
            tagNames: normalizeTagNames(e.tagNames),
            strength: Math.min(5, Math.max(1, Math.round(Number(e.strength) || 3))),
            row: typeof e.row === "number" && Number.isFinite(e.row) ? e.row : 0,
            description: e.description ?? null,
          },
        }
      }

      // update
      const e = action.payload ?? {}
      const normalized: GenerateCareerEventAction["payload"] = { id: e.id }
      if (e.name !== undefined) normalized.name = e.name
      else if (e.startName !== undefined) normalized.name = e.startName
      if (e.type !== undefined) {
        normalized.type = validTypes.includes(e.type) ? e.type : undefined
      }
      if (e.startDate !== undefined) normalized.startDate = ensureDate(e.startDate, fallbackDate)
      if (e.endDate !== undefined) normalized.endDate = ensureDate(e.endDate, fallbackDate)
      if (e.tagNames !== undefined) {
        normalized.tagNames = normalizeTagNames(e.tagNames)
      }
      if (e.strength !== undefined) {
        normalized.strength = Math.min(5, Math.max(1, Math.round(Number(e.strength) || 3)))
      }
      if (e.row !== undefined) {
        normalized.row = typeof e.row === "number" && Number.isFinite(e.row) ? e.row : undefined
      }
      if (e.description !== undefined) normalized.description = e.description ?? null

      return { type: "update", payload: normalized }
    })
}
