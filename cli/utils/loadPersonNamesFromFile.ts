import { readFileSync } from 'fs'
import { resolve } from 'path'

export function loadPersonNamesFromFile(filePath: string): string[] {
  const content = readFileSync(resolve(filePath), 'utf-8')
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
}
