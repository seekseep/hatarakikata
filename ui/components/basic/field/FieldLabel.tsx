import { ReactNode } from "react"

type FieldLabelProps = {
  htmlFor?: string
  children: ReactNode
}

export default function FieldLabel({ htmlFor, children }: FieldLabelProps) {
  const className = "font-medium"

  if (htmlFor) {
    return <label htmlFor={htmlFor} className={className}>{children}</label>
  }

  return <span className={className}>{children}</span>
}
