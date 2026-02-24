import * as fs from 'fs'
import * as path from 'path'

import { CareerDataSchema } from '@/core/application/port/command/careerData/saveCareerDataCommand'
import type { ReadCareerDataQuery } from '@/core/application/port/query/careerData/readCareerDataQuery'
import { failAsExternalServiceError, failAsNotFoundError, succeed } from '@/core/util/appResult'

const CAREER_MAPS_DIR = path.resolve(process.cwd(), 'data/careerMaps')

export const readCareerDataQuery: ReadCareerDataQuery = async (personName) => {
  try {
    const filePath = path.join(CAREER_MAPS_DIR, `${personName}.json`)

    if (!fs.existsSync(filePath)) {
      return failAsNotFoundError(`Career data not found: ${personName}`)
    }

    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const validation = CareerDataSchema.safeParse(raw)

    if (!validation.success) {
      return failAsExternalServiceError(`Invalid career data format: ${validation.error.message}`, validation.error)
    }

    return succeed(validation.data)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return failAsExternalServiceError(message, error)
  }
}
