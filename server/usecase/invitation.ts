import { makeRedeemInvitation } from '@/core/application/usecase/invitation/redeemInvitation'
import { updateInvitationCommand, updateMembershipCommand } from '@/infrastructure/server/supabase/command'
import { findInvitationByCodeQuery } from '@/infrastructure/server/supabase/query'

export const redeemInvitation = makeRedeemInvitation({
  findInvitationByCodeQuery,
  updateInvitationCommand,
  updateMembershipCommand,
})
