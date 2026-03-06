import type { DeleteAuthUserByEmailCommand } from "@/core/application/port/command"
import { failAsExternalServiceError, succeed } from "@/core/util/appResult"

import { createSupabaseAdmin } from "../../client"

export const deleteAuthUserByEmailCommand: DeleteAuthUserByEmailCommand = async (parameters) => {
  const supabase = createSupabaseAdmin()

  const { data, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) return failAsExternalServiceError(listError.message, listError)

  const authUser = data.users.find((u) => u.email === parameters.email)
  if (!authUser) return succeed(undefined)

  const { error } = await supabase.auth.admin.deleteUser(authUser.id)
  if (error) return failAsExternalServiceError(error.message, error)

  return succeed(undefined)
}
