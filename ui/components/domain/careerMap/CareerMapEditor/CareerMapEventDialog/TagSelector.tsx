"use client"

import { useState } from "react"
import { RxCross2 } from "react-icons/rx"

import type { CareerMapEventTag } from "@/core/domain"
import Spinner from "@/ui/components/basic/Spinner"

type TagSelectorProps = {
  tags: string[]
  setTags: (tags: string[]) => void
  availableTags: CareerMapEventTag[]
  isLoadingTags: boolean
}

export default function TagSelector({
  tags,
  setTags,
  availableTags,
  isLoadingTags,
}: TagSelectorProps) {
  const [filter, setFilter] = useState("")

  const selectedTags = availableTags.filter((tag) => tags.includes(tag.id))
  const unselectedTags = availableTags.filter((tag) => !tags.includes(tag.id))
  const filteredUnselectedTags = filter
    ? unselectedTags.filter((tag) => tag.name.includes(filter))
    : unselectedTags

  const toggleTag = (tagId: string) => {
    if (tags.includes(tagId)) {
      setTags(tags.filter((id) => id !== tagId))
    } else {
      setTags([...tags, tagId])
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">タグ</label>
      {isLoadingTags ? (
        <Spinner size="small" />
      ) : (
        <>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-500 text-white px-2.5 py-0.5 text-sm transition-colors"
                >
                  {tag.name}
                  <RxCross2 size={12} />
                </button>
              ))}
            </div>
          )}
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="タグを検索..."
            className="rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {filteredUnselectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filteredUnselectedTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="inline-flex items-center rounded-full bg-foreground/10 text-foreground/70 hover:bg-foreground/20 px-2.5 py-0.5 text-sm transition-colors"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
