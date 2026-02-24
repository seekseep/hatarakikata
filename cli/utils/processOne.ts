import cliProgress from 'cli-progress'

import type { Executor } from '@/core/application/executor'

import { makeProgressAwareUsecase, STEPS } from './makeProgressAwareUsecase'

export async function processOne(personName: string, language: string, executor: Executor) {
  const multiBar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: ' {bar} {percentage}% | {value}/{total} | {task}',
  }, cliProgress.Presets.shades_classic)

  const bar = multiBar.create(STEPS.length, 0, { task: '開始...' })

  const usecase = makeProgressAwareUsecase(bar)
  const result = await usecase({ personName, language }, executor)

  if (result.success) {
    bar.update(STEPS.length, { task: '完了' })
  } else if (result.error.type === 'ConflictError') {
    bar.update(STEPS.length, { task: 'スキップ (既存)' })
  } else {
    bar.update(bar.getProgress() * STEPS.length, { task: `失敗: ${result.error.message}` })
  }

  multiBar.stop()
  return result
}
