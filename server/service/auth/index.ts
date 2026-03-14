import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { UserExecutor } from '@/core/application/executor'
import type { User } from '@/core/domain'

export async function getExecutor(): Promise<UserExecutor> {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    },
  )

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return guest()
  }

  return general({
    id: data.user.id,
    name: '',
    balance: 0,
    membership: { plan: 'free' },
  })
}

function general(user: User): UserExecutor {
  return { type: 'user', userType: 'general', user }
}

function guest(): UserExecutor {
  return { type: 'user', userType: 'guest', user: { id: '', name: '', balance: 0, membership: { plan: 'free' } } }
}
