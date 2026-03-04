"use client"

import AddEventButton from "./AddEventButton"
import AlignEventsButton from "./AlignEventsButton"
import CareerGuideButton from "./CareerGuideButton"
import DevMenuButton from "./DevMenuButton"
import GenerateButton from "./GenerateButton"
import QuestionsButton from "./QuestionsButton"
import SearchButton from "./SearchButton"

export default function CarrerMapCanvasActions() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-white rounded-full shadow-lg p-1.5">
      <DevMenuButton />
      <QuestionsButton />
      <CareerGuideButton />
      <AlignEventsButton />
      <SearchButton />
      <GenerateButton />
      <AddEventButton />
    </div>
  )
}
