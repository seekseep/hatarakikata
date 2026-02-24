import type { CreateAuthUserCommand } from "@/core/application/port/command"
import { failAsExternalServiceError, succeed } from "@/core/util/appResult"

import { createSupabaseAdmin } from "../../client"

export const createAuthUserCommand: CreateAuthUserCommand = async (parameters) => {
  try {
    const supabase = createSupabaseAdmin()
    const { data, error } = await supabase.auth.admin.createUser({
      email: parameters.email,
      password: parameters.password,
      email_confirm: true,
    })

    if (error) return failAsExternalServiceError(error.message, error)

    return succeed({ id: data.user.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
