"use client"

import { RiCloseLine } from "react-icons/ri"

import FieldContainer from "./FieldContainer"
import FieldLabel from "./FieldLabel"

type TagsFieldProps = {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  error?: string
  className?: string
}

export default function TagsField({
  label,
  value,
  onChange,
  error,
  className,
}: TagsFieldProps) {
  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <FieldContainer className={className}>
      <FieldLabel>{label}</FieldLabel>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-0.5 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="rounded-full hover:bg-foreground/20 p-0.5 transition-colors"
                aria-label={`${tag}を削除`}
              >
                <RiCloseLine size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </FieldContainer>
  )
}
