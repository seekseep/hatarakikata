import { makeCreateCareerEvent } from '@/core/application/usecase/careerEvent/createCareerEvent'
import { makeDeleteCareerEvent } from '@/core/application/usecase/careerEvent/deleteCareerEvent'
import { makeGenerateCareerEvents } from '@/core/application/usecase/careerEvent/generateCareerEvents'
import { makeGetCareerEvent } from '@/core/application/usecase/careerEvent/getCareerEvent'
import { makeListCareerEventsByCareerMapId } from '@/core/application/usecase/careerEvent/listCareerEventsByCareerMapId'
import { makeUpdateCareerEvent } from '@/core/application/usecase/careerEvent/updateCareerEvent'
import { generateCareerEvents as generateCareerEventsAi } from '@/infrastructure/server/ai'
import { createCareerEventCommand, deleteCareerEventCommand,updateCareerEventCommand } from '@/infrastructure/server/supabase/command'
import { findCareerEventQuery, findCareerMapQuery, listCareerEventsByCareerMapIdQuery, listCareerMapEventTagsQuery } from '@/infrastructure/server/supabase/query'

export const createCareerEvent = makeCreateCareerEvent({
  createCareerEventCommand,
  findCareerMapQuery,
})

export const updateCareerEvent = makeUpdateCareerEvent({
  updateCareerEventCommand,
  findCareerEventQuery,
  findCareerMapQuery,
})

export const deleteCareerEvent = makeDeleteCareerEvent({
  deleteCareerEventCommand,
  findCareerEventQuery,
  findCareerMapQuery,
})

export const getCareerEvent = makeGetCareerEvent({
  findCareerEventQuery,
  findCareerMapQuery,
})

export const listCareerEventsByCareerMapId = makeListCareerEventsByCareerMapId({
  listCareerEventsByCareerMapIdQuery,
  findCareerMapQuery,
})

export const generateCareerEvents = makeGenerateCareerEvents({
  generateCareerEvents: generateCareerEventsAi,
  createCareerEventCommand,
  updateCareerEventCommand,
  findCareerMapQuery,
  listCareerMapEventTagsQuery,
})
