export function getIntParam(
  searchParams: URLSearchParams,
  key: string,
  options: { default: number; min?: number; max?: number }
): number {
  const raw = searchParams.get(key)
  const parsed = Number(raw ?? options.default)
  if (!Number.isFinite(parsed)) return options.default
  let value = Math.floor(parsed)
  if (options.min !== undefined) value = Math.max(options.min, value)
  if (options.max !== undefined) value = Math.min(options.max, value)
  return value
}
