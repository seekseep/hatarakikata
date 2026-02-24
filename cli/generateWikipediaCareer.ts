import 'dotenv/config'

import { Command } from 'commander'
import inquirer from 'inquirer'
import pLimit from 'p-limit'

import type { SystemExecutor } from '../core/application/executor'
import { loadPersonNamesFromFile } from './utils/loadPersonNamesFromFile'
import { processOne } from './utils/processOne'

const CONCURRENCY = 5

const program = new Command()

program
  .name('generate-wikipedia-career')
  .description('WikipediaページからキャリアデータをAIで生成する')
  .argument('[personNames...]', '人物名（複数指定可）')
  .option('-l, --language <code>', 'Wikipedia言語コード', 'ja')
  .option('-f, --file <path>', '人物名リストファイル（1行1名、# コメント行は無視）')

program.parse()

const args = program.args
const opts = program.opts<{ language: string; file?: string }>()

const executor: SystemExecutor = {
  type: 'system',
  operation: { name: 'generate-wikipedia-career' },
}

async function main() {
  const language = opts.language
  let personNames: string[] = args

  if (opts.file) {
    personNames = loadPersonNamesFromFile(opts.file)
  }

  if (personNames.length === 0) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'personName',
        message: '人物名を入力してください:',
        validate: (input: string) => input.trim() ? true : '人物名を入力してください',
      },
    ])
    personNames = [answers.personName]
  }

  console.log(`\n${personNames.length}件をWikipediaページからキャリアデータを生成します（最大${CONCURRENCY}件並列）...\n`)

  const limit = pLimit(CONCURRENCY)

  await Promise.all(
    personNames.map((personName, i) =>
      limit(async () => {
        console.log(`\n▶ ${personName} (${i + 1}/${personNames.length})`)
        const result = await processOne(personName, language, executor)

        if (!result.success) {
          if (result.error.type === 'ConflictError') {
            console.log(`  [${personName}] スキップ: データが既に存在します`)
          } else {
            console.error(`  [${personName}] 失敗: ${result.error.type} - ${result.error.message}`)
          }
        } else {
          console.log(`  [${personName}] Wikipedia URL: ${result.data.wikipediaUrl}`)
          console.log(`  [${personName}] 推定生年月日: ${result.data.birthDate ?? '不明'}`)
          console.log(`  [${personName}] イベント数: ${result.data.events.length}`)
        }
      })
    )
  )

  console.log('\n=== 全処理完了 ===')
}

main().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
