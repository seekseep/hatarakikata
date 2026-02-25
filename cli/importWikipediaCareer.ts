import 'dotenv/config'

import inquirer from 'inquirer'

import type { SystemExecutor } from '../core/application/executor'
import { importCareerData, listCareerData } from './usecase'

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

  const { personNames } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'personNames',
      message: 'インポートするデータを選択してください:',
      choices: names,
      validate: (input: string[]) => input.length > 0 ? true : '1つ以上選択してください',
    },
  ])

  for (const personName of personNames) {
    try {
      console.log(`\n${personName} のキャリアデータをDBにインポートします...`)

      let result = await importCareerData({ personName }, executor)

      if (!result.success && result.error.type === 'ConflictError') {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: `${result.error.message} 上書きしますか？`,
            default: false,
          },
        ])
        if (!overwrite) {
          console.log(`スキップ: ${personName}`)
          continue
        }
        result = await importCareerData({ personName, force: true }, executor)
      }

      if (!result.success) {
        console.error(`Failed (${personName}):`, result.error.type, result.error.message)
        continue
      }

      console.log(`\n=== ${personName} インポート完了 ===`)
      console.log(`ユーザーID: ${result.data.userId}`)
      console.log(`キャリアマップID: ${result.data.careerMapId}`)
      console.log(`作成されたイベント数: ${result.data.events.length}`)
      console.log('イベント一覧:')
      for (const event of result.data.events) {
        console.log(`  - ${event.name ?? event.startName} (${event.type}) ${event.startDate} ~ ${event.endDate}`)
      }
    } catch (error) {
      console.error(`Unexpected error (${personName}):`, error)
    }
  }
}

main()
