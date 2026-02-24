import { makeListCareerMapEventTags } from '@/core/application/usecase/careerMapEventTag/listCareerMapEventTags'
import { listCareerMapEventTagsQuery } from '@/infrastructure/server/supabase/query'

export const listCareerMapEventTags = makeListCareerMapEventTags({
  listCareerMapEventTagsQuery,
})
