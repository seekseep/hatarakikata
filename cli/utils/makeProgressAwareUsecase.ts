import cliProgress from 'cli-progress'

import { makeGenerateCareerFromWikipedia } from '@/core/application/usecase/careerMap/generateCareerFromWikipedia'
import { generateCareerEventsFromBiography } from '@/infrastructure/server/ai/operation/generateCareerEventsFromBiography'
import { saveWikipediaMarkdownCacheCommand } from '@/infrastructure/server/fs/command/wikipedia/saveWikipediaMarkdownCacheCommand'
import { saveCareerDataCommand } from '@/infrastructure/server/fs/command/careerData/saveCareerDataCommand'
import { listCareerDataQuery } from '@/infrastructure/server/fs/query/careerData/listCareerDataQuery'
import { readWikipediaMarkdownCacheQuery } from '@/infrastructure/server/fs/query/wikipedia/readWikipediaMarkdownCacheQuery'
import { listCareerMapEventTagsQuery } from '@/infrastructure/server/supabase/query/careerMapEventTag/listCareerMapEventTagsQuery'
import { fetchWikipediaBiography } from '@/infrastructure/server/wikipedia/fetchWikipediaBiography'

export const STEPS = [
  '既存データ確認',
  'タグ一覧取得',
  'Wikipedia取得',
  'AIでキャリア生成',
  'データ保存',
] as const

export function makeProgressAwareUsecase(bar: cliProgress.SingleBar) {
  let step = 0

  function tick(label: string) {
    step++
    bar.update(step, { task: label })
  }

  function wrap<T extends (...args: Parameters<T>) => ReturnType<T>>(label: string, fn: T): T {
    return (async (...args: Parameters<T>) => {
      tick(label)
      return fn(...args)
    }) as T
  }

  return makeGenerateCareerFromWikipedia({
    listCareerDataQuery: wrap(STEPS[0], listCareerDataQuery),
    listCareerMapEventTagsQuery: wrap(STEPS[1], listCareerMapEventTagsQuery),
    // キャッシュ確認がステップとして表示される。ヒット時は fetch/save は呼ばれない
    readWikipediaMarkdownCacheQuery: wrap(STEPS[2], readWikipediaMarkdownCacheQuery),
    fetchWikipediaBiography,
    saveWikipediaMarkdownCacheCommand,
    generateCareerEventsFromBiography: wrap(STEPS[3], generateCareerEventsFromBiography),
    saveCareerDataCommand: wrap(STEPS[4], saveCareerDataCommand),
  })
}
