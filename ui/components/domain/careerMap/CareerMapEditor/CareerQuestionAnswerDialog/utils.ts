import type { CareerQuestionFieldCondition } from "@/core/domain"

export function evaluateCondition(
  condition: CareerQuestionFieldCondition,
  values: Record<string, unknown>,
): boolean {
  const matchExpr = (expr: { name: string; value: unknown }) =>
    values[expr.name] === expr.value

  const andOk = !condition.and || condition.and.every(matchExpr)
  const orOk = !condition.or || condition.or.some(matchExpr)

  return andOk && orOk
}
