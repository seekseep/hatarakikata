'use client'

import Link from 'next/link'
import { RiUserLine } from 'react-icons/ri'

import { useGetCurrentUserQuery } from '@/ui/hooks/user'

const maxWidthStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
} as const

type MaxWidth = keyof typeof maxWidthStyles

type GlobalNavigationProps = {
  maxWidth?: MaxWidth
}

export default function GlobalNavigation({ maxWidth = '5xl' }: GlobalNavigationProps) {
  const { data: currentUser } = useGetCurrentUserQuery()

  return (
    <header className="bg-background border-b border-foreground/10">
      <div className={`mx-auto flex h-14 items-center justify-between px-4 ${maxWidthStyles[maxWidth]}`}>
        <Link href="/" className="text-lg font-bold">
          ハタラキカタ
        </Link>
        <Link
          href="/me"
          className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          <RiUserLine className="text-lg" />
          <span>{currentUser?.name ?? 'マイページ'}</span>
        </Link>
      </div>
    </header>
  )
}
