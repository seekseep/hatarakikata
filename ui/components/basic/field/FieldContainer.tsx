import clsx from "clsx"
import { ReactNode } from "react"

type FieldContainerProps = {
  className?: string
  children: ReactNode
}

export default function FieldContainer({ className, children }: FieldContainerProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {children}
    </div>
  )
}
