import 'dotenv/config'

import cliProgress from 'cli-progress'

import type { SystemExecutor } from '../core/application/executor'
import { createReadjustAllCareerMapRows } from './usecase/careerMap'

async function main() {
  const executor: SystemExecutor = {
    type: 'system',
    operation: { name: 'readjust-rows' },
  }

  const bar = new cliProgress.SingleBar(
    {
      format: ' {bar} {percentage}% | {value}/{total} maps | failed: {failed}',
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  )

  bar.start(0, 0, { failed: 0 })

  const readjustAllCareerMapRows = createReadjustAllCareerMapRows(
    (current, total, failed) => {
      bar.setTotal(total)
      bar.update(current, { failed })
    },
  )

  const result = await readjustAllCareerMapRows(executor)

  bar.stop()

  if (!result.success) {
    console.error('Failed:', result.error.message)
    process.exit(1)
  }

  console.log(
    `Done: ${result.data.mapsProcessed} maps processed, ${result.data.eventsAdjusted} events adjusted, ${result.data.failed} failed`
  )
}

main()
