import * as fs from 'fs'
import * as path from 'path'

import type { ListCareerDataQuery } from '@/core/application/port/query/careerData/listCareerDataQuery'
import { succeed } from '@/core/util/appResult'

const CAREER_MAPS_DIR = path.resolve(process.cwd(), 'data/people/careerMaps')

export const listCareerDataQuery: ListCareerDataQuery = async () => {
  if (!fs.existsSync(CAREER_MAPS_DIR)) {
    return succeed({ names: [] })
  }

  const names = fs.readdirSync(CAREER_MAPS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))

  return succeed({ names })
}
