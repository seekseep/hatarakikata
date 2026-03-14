import type { User } from "@/core/domain/entity/user"

import type { UserRow, UserRowWithCreditAndMembership } from "../schemas"

export function userRowToEntity(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    balance: 0,
    membership: { plan: 'free' },
  }
}

export function userRowWithCreditAndMembershipToEntity(row: UserRowWithCreditAndMembership): User {
  // Supabase returns object for 1:1 relations but types them as arrays
  const cb = row.credit_balances as unknown
  const mb = row.memberships as unknown
  const balance = Array.isArray(cb) ? (cb[0]?.balance ?? 0) : ((cb as { balance: number } | null)?.balance ?? 0)
  const plan = (Array.isArray(mb) ? (mb[0]?.plan ?? 'free') : ((mb as { plan: string } | null)?.plan ?? 'free')) as 'free' | 'premium'

  return {
    id: row.id,
    name: row.name,
    balance,
    membership: { plan },
  }
}

export function userEntityToRow(entity: User): UserRow {
  return {
    id: entity.id,
    name: entity.name,
  }
}
