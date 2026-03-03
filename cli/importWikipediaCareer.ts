import 'dotenv/config'

import cliProgress from 'cli-progress'
import inquirer from 'inquirer'
import pLimit from 'p-limit'

import type { SystemExecutor } from '../core/application/executor'
import { importCareerData, listCareerData } from './usecase'

const isAll = process.argv.includes('--all')
const CONCURRENCY = 5

async function main() {
  const executor: SystemExecutor = {
    type: 'system',
    operation: { name: 'import-wikipedia-career' },
  }

  const listResult = await listCareerData(executor)

  if (!listResult.success) {
    console.error('Failed:', listResult.error.message)
    process.exit(1)
  }

  const { names } = listResult.data

  if (names.length === 0) {
    console.error('data/ にデータがありません。先に generate-wikipedia-career を実行してください。')
    process.exit(1)
  }

  let personNames: string[]

  if (isAll) {
    personNames = names
  } else {
    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'personNames',
        message: 'インポートするデータを選択してください:',
        choices: names,
        validate: (input: string[]) => input.length > 0 ? true : '1つ以上選択してください',
      },
    ])
    personNames = answer.personNames
  }

  const multiBar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: ' {bar} {percentage}% | {value}/{total} | {status}',
  }, cliProgress.Presets.shades_classic)

  const totalBar = multiBar.create(personNames.length, 0, { status: 'インポート中...' })

  type ImportResult = Awaited<ReturnType<typeof importCareerData>>
  type SuccessData = Extract<ImportResult, { success: true }>['data']

  type Result = {
    personName: string
    status: 'success' | 'skipped' | 'failed'
    message?: string
    data?: SuccessData
  }

  const results: Result[] = []
  let completed = 0

  const limit = pLimit(CONCURRENCY)

  const tasks = personNames.map((personName) =>
    limit(async () => {
      try {
        let result = await importCareerData({ personName }, executor)

        if (!result.success && result.error.type === 'ConflictError') {
          if (isAll) {
            result = await importCareerData({ personName, force: true }, executor)
          } else {
            results.push({ personName, status: 'skipped', message: result.error.message })
            completed++
            totalBar.update(completed)
            return
          }
        }

        if (!result.success) {
          results.push({ personName, status: 'failed', message: `${result.error.type}: ${result.error.message}` })
          completed++
          totalBar.update(completed)
          return
        }

        results.push({ personName, status: 'success', data: result.data })
      } catch (error) {
        results.push({ personName, status: 'failed', message: String(error) })
      } finally {
        completed++
        totalBar.update(completed)
      }
    }),
  )

  await Promise.all(tasks)
  totalBar.update(personNames.length, { status: '完了' })
  multiBar.stop()

  // 結果サマリー
  const succeeded = results.filter((r) => r.status === 'success')
  const skipped = results.filter((r) => r.status === 'skipped')
  const failed = results.filter((r) => r.status === 'failed')

  console.log(`\n=== インポート結果 ===`)
  console.log(`成功: ${succeeded.length} / スキップ: ${skipped.length} / 失敗: ${failed.length}`)

  for (const r of succeeded) {
    if (r.data) {
      console.log(`  [成功] ${r.personName} (イベント数: ${r.data.events.length})`)
    }
  }
  for (const r of skipped) {
    console.log(`  [スキップ] ${r.personName}: ${r.message}`)
  }
  for (const r of failed) {
    console.log(`  [失敗] ${r.personName}: ${r.message}`)
  }
}

main()
