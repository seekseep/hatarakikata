import type { CareerEvent } from "@/core/domain"

import type {
  CloseDialogAction,
  OpenCreateDialogAction,
  OpenEditDialogAction,
  OpenGenerateDialogAction,
  OpenJsonImportDialogAction,
  OpenQuestionsDrawerAction,
  OpenSearchDialogAction,
  OpenViewerAction,
} from "../hooks/EditorAction"
import type { CreatePrefill } from "../hooks/EditorState"

export function openCreateDialog(prefill?: CreatePrefill): OpenCreateDialogAction {
  return { type: 'OPEN_CREATE_DIALOG', prefill }
}

export function openEditDialog(event: CareerEvent): OpenEditDialogAction {
  return { type: 'OPEN_EDIT_DIALOG', event }
}

export function openGenerateDialog(): OpenGenerateDialogAction {
  return { type: 'OPEN_GENERATE_DIALOG' }
}

export function openSearchDialog(): OpenSearchDialogAction {
  return { type: 'OPEN_SEARCH_DIALOG' }
}

export function openJsonImportDialog(): OpenJsonImportDialogAction {
  return { type: 'OPEN_JSON_IMPORT_DIALOG' }
}

export function openViewer(careerMapId: string): OpenViewerAction {
  return { type: 'OPEN_VIEWER', careerMapId }
}

export function openQuestionsDrawer(): OpenQuestionsDrawerAction {
  return { type: 'OPEN_QUESTIONS_DRAWER' }
}

export function closeDialog(): CloseDialogAction {
  return { type: 'CLOSE_DIALOG' }
}
