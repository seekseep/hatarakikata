import type { ListCareerMapsExcludingUserQuery } from '@/core/application/port/query'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'

export const listCareerMapsExcludingUserQuery: ListCareerMapsExcludingUserQuery = async ({ excludeUserId, limit = 10, offset = 0 }) => {
  const supabase = createSupabaseAdmin()

  const { data: mapData, error: mapError, count } = await supabase
    .from('career_maps')
    .select('id, user_id, start_date', { count: 'exact' })
    .neq('user_id', excludeUserId)
    .range(offset, offset + limit - 1)

  if (mapError) return failAsExternalServiceError(mapError.message, mapError)

  const maps = mapData ?? []
  const userIds = [...new Set(maps.map((m) => m.user_id))]

  const userNameById = new Map<string, string | null>()
  if (userIds.length > 0) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', userIds)

    if (userError) return failAsExternalServiceError(userError.message, userError)

    for (const user of userData ?? []) {
      userNameById.set(user.id, user.name)
    }
  }

  return succeed({
    items: maps.map((row) => ({
      id: row.id,
      userId: row.user_id,
      userName: userNameById.get(row.user_id) ?? null,
      startDate: row.start_date,
    })),
    count: count ?? 0,
    offset,
    limit,
  })
}
