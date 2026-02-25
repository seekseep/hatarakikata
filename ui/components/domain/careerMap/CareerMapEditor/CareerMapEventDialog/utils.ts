export function toMonth(dateStr: string): string {
  if (!dateStr) return ""
  return dateStr.slice(0, 7)
}

export function fromMonth(monthStr: string): string {
  if (!monthStr) return ""
  return `${monthStr}-01`
}
