'use client'

import { PropsWithChildren } from 'react'

import GlobalHeader from '@/ui/components/domain/GlobalNavigation'

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-foreground/5">
      <GlobalHeader maxWidth="xl" />
      <div className="max-w-xl mx-auto space-y-4 p-4">
        {children}
      </div>
    </div>
  )
}
