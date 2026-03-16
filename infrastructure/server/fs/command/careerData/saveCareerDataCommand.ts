import * as fs from 'fs'
import * as path from 'path'

import type { SaveCareerDataCommand } from '@/core/application/port/command/careerData/saveCareerDataCommand'
import { failAsExternalServiceError, succeed } from '@/core/util/appResult'

const CAREER_MAPS_DIR = path.resolve(process.cwd(), 'data/careerMaps')

export const saveCareerDataCommand: SaveCareerDataCommand = async (parameters) => {
  try {
    if (!fs.existsSync(CAREER_MAPS_DIR)) fs.mkdirSync(CAREER_MAPS_DIR, { recursive: true })

    const filePath = path.join(CAREER_MAPS_DIR, `${parameters.personName}.json`)
    fs.writeFileSync(filePath, JSON.stringify(parameters, null, 2), 'utf-8')

    return succeed({ filePath })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
