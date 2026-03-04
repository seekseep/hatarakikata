import type { CareerEvent, CareerQuestion } from "@/core/domain"

import type {
  CloseDialogAction,
  EditorAction,
  OpenCareerGuideDetailDrawerAction,
  OpenCareerGuidePromptDialogAction,
  OpenCareerGuidesDrawerAction,
  OpenConfirmDialogAction,
  OpenCreateDialogAction,
  OpenEditDialogAction,
  OpenGenerateDialogAction,
  OpenJsonImportDialogAction,
  OpenQuestionAnswerDialogAction,
  OpenQuestionsDrawerAction,
  OpenSearchDrawerAction,
  OpenViewerAction,
  RequestCreateCareerGuideAction,
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

export function openSearchDrawer(): OpenSearchDrawerAction {
  return { type: 'OPEN_SEARCH_DRAWER' }
}

export function openJsonImportDialog(): OpenJsonImportDialogAction {
  return { type: 'OPEN_JSON_IMPORT_DIALOG' }
}

export function openViewer(careerMapId: string, userName?: string): OpenViewerAction {
  return { type: 'OPEN_VIEWER', careerMapId, userName }
}

export function openQuestionsDrawer(): OpenQuestionsDrawerAction {
  return { type: 'OPEN_QUESTIONS_DRAWER' }
}

export function openQuestionAnswerDialog(question: CareerQuestion): OpenQuestionAnswerDialogAction {
  return { type: 'OPEN_QUESTION_ANSWER_DIALOG', question }
}

export function openConfirmDialog(message: string, confirmAction: EditorAction): OpenConfirmDialogAction {
  return { type: 'OPEN_CONFIRM_DIALOG', message, confirmAction }
}

export function requestCreateCareerGuide(careerMapId: string): RequestCreateCareerGuideAction {
  return { type: 'REQUEST_CREATE_CAREER_GUIDE', careerMapId }
}

export function openCareerGuidePromptDialog(): OpenCareerGuidePromptDialogAction {
  return { type: 'OPEN_CAREER_GUIDE_PROMPT_DIALOG' }
}

export function openCareerGuidesDrawer(): OpenCareerGuidesDrawerAction {
  return { type: 'OPEN_CAREER_GUIDES_DRAWER' }
}

export function openCareerGuideDetailDrawer(guideId: string): OpenCareerGuideDetailDrawerAction {
  return { type: 'OPEN_CAREER_GUIDE_DETAIL_DRAWER', guideId }
}

export function closeDialog(): CloseDialogAction {
  return { type: 'CLOSE_DIALOG' }
}
