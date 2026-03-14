import 'dotenv/config'

import cliProgress from 'cli-progress'
import * as crypto from 'crypto'
import * as fs from 'fs'
import inquirer from 'inquirer'
import pLimit from 'p-limit'
import * as path from 'path'

import type { SystemExecutor } from '../core/application/executor'
import { listUserNamesQuery } from '../infrastructure/server/supabase/query/user'
import { importCareerData, listCareerData } from './usecase'

const isAll = process.argv.includes('--all')
const CONCURRENCY = 5

function generatePassword(): string {
  return crypto.randomBytes(6).toString('base64url').slice(0, 8)
}

async function main() {
  const executor: SystemExecutor = {
    type: 'system',
    operation: { name: 'import-users' },
  }

  const listResult = await listCareerData(executor)

  if (!listResult.success) {
    console.error('Failed:', listResult.error.message)
    process.exit(1)
  }

  const { names } = listResult.data

  if (names.length === 0) {
    console.error('data/people/careerMaps/ にデータがありません。')
    process.exit(1)
  }

  const existingUsersResult = await listUserNamesQuery()
  const existingNames = existingUsersResult.success ? existingUsersResult.data.names : []

  let personNames: string[]

  if (isAll) {
    personNames = names
  } else {
    const choices = names.map((name) => {
      const isExisting = existingNames.includes(name)
      return {
        name: isExisting ? `${name} (登録済み)` : name,
        value: name,
      }
    })

    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'personNames',
        message: 'インポートするユーザーを選択してください:',
        choices,
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

  type Result = {
    personName: string
    email: string
    password: string
    status: 'success' | 'failed'
    message?: string
    eventCount?: number
  }

  const results: Result[] = []
  let completed = 0

  const limit = pLimit(CONCURRENCY)

  const tasks = personNames.map((personName, index) =>
    limit(async () => {
      const email = `user${index + 1}@example.com`
      const password = generatePassword()

      try {
        const result = await importCareerData({ personName, email, password, force: true }, executor)

        if (!result.success) {
          results.push({ personName, email, password, status: 'failed', message: `${result.error.type}: ${result.error.message}` })
          completed++
          totalBar.update(completed)
          return
        }

        results.push({ personName, email, password, status: 'success', eventCount: result.data.events.length })
      } catch (error) {
        results.push({ personName, email, password, status: 'failed', message: String(error) })
      } finally {
        completed++
        totalBar.update(completed)
      }
    }),
  )

  await Promise.all(tasks)
  totalBar.update(personNames.length, { status: '完了' })
  multiBar.stop()

  results.sort((a, b) => a.email.localeCompare(b.email, undefined, { numeric: true }))
  const succeeded = results.filter((r) => r.status === 'success')
  const failed = results.filter((r) => r.status === 'failed')

  console.log(`\n=== インポート結果 ===`)
  console.log(`成功: ${succeeded.length} / 失敗: ${failed.length}`)

  for (const r of succeeded) {
    console.log(`  [成功] ${r.personName} (イベント数: ${r.eventCount})`)
  }
  for (const r of failed) {
    console.log(`  [失敗] ${r.personName}: ${r.message}`)
  }

  // 認証情報を Markdown に出力
  if (succeeded.length > 0) {
    const outDir = path.resolve(process.cwd(), 'out')
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true })
    }

    const lines = [
      '# ユーザー認証情報',
      '',
      '| 名前 | メール | パスワード |',
      '|------|--------|-----------|',
      ...succeeded.map((r) => `| ${r.personName} | ${r.email} | ${r.password} |`),
      '',
    ]

    const filePath = path.join(outDir, 'users.md')
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8')
    console.log(`\n認証情報を ${filePath} に出力しました。`)
  }
}

main()
