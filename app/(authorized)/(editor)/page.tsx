'use client'

import { useEffect } from 'react'

import Spinner from '@/ui/components/basic/Spinner'
import CareerMapEditor from '@/ui/components/domain/careerMap/CareerMapEditor'
import { useCreateMyCareerMapMutation,useMyCareerMapsQuery } from '@/ui/hooks/careerMap'

export default function HomePage() {
  const { data: careerMaps, refetch: refetchMaps } = useMyCareerMapsQuery()
  const createMapMutation = useCreateMyCareerMapMutation()

  const careerMapId = careerMaps?.items[0]?.id
  const hasLoaded = careerMaps !== undefined
  const hasNoMaps = hasLoaded && careerMaps.items.length < 1

  useEffect(() => {
    if (hasNoMaps && !createMapMutation.isPending && !createMapMutation.isSuccess) {
      createMapMutation.mutate(undefined, {
        onSuccess: () => refetchMaps(),
      })
    }
  }, [hasNoMaps, createMapMutation.isPending, createMapMutation.isSuccess, createMapMutation, refetchMaps])

  if (!careerMapId) {
    return <div className="flex items-center justify-center w-full h-full"><Spinner /></div>
  }

  return <CareerMapEditor careerMapId={careerMapId} />
}
