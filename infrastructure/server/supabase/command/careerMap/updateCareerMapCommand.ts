import type { UpdateCareerMapCommand } from '@/core/application/port/command'
import { failAsExternalServiceError,succeed } from '@/core/util/appResult'

import { createSupabaseAdmin } from '../../client'
import { careerMapRowToEntity } from '../../converter'

export const updateCareerMapCommand: UpdateCareerMapCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()
  const updateData: Record<string, unknown> = {}
  if (parameters.userId !== undefined) updateData.user_id = parameters.userId
  if (parameters.startDate !== undefined) updateData.start_date = parameters.startDate

  const { data, error } = await supabase
    .from('career_maps')
    .update(updateData)
    .eq('id', parameters.id)
    .select('id, user_id, start_date')
    .single()

  if (error) return failAsExternalServiceError(error.message, error)

  return succeed(careerMapRowToEntity(data))
}
