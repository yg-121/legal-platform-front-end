import api, { uploadFile } from "./api"
import type { Case, CaseFilters, CaseFormData } from "../types/case"
import type { ApiResponse } from "../types/api"

export const caseService = {
  getCases: async (filters?: CaseFilters): Promise<ApiResponse<Case[]>> => {
    const params = new URLSearchParams()

    if (filters) {
      if (filters.status) params.append("status", filters.status)
      if (filters.category) params.append("category", filters.category)
      if (filters.search) params.append("search", filters.search)
      if (filters.page) params.append("page", filters.page.toString())
      if (filters.limit) params.append("limit", filters.limit.toString())
    }

    const response = await api.get<ApiResponse<Case[]>>("/cases", { params })
    return response.data
  },

  getMyCases: async (filters?: CaseFilters): Promise<ApiResponse<Case[]>> => {
    const params = new URLSearchParams()

    if (filters) {
      if (filters.status) params.append("status", filters.status)
      if (filters.category) params.append("category", filters.category)
      if (filters.search) params.append("search", filters.search)
      if (filters.page) params.append("page", filters.page.toString())
      if (filters.limit) params.append("limit", filters.limit.toString())
    }

    const response = await api.get<ApiResponse<Case[]>>("/cases/my-cases", { params })
    return response.data
  },

  getCaseById: async (caseId: string): Promise<ApiResponse<Case>> => {
    const response = await api.get<ApiResponse<Case>>(`/cases/${caseId}`)
    return response.data
  },

  createCase: async (caseData: CaseFormData): Promise<ApiResponse<Case>> => {
    // First create the case without attachments
    const { attachments, ...caseDataWithoutFiles } = caseData
    const response = await api.post<ApiResponse<Case>>("/cases", caseDataWithoutFiles)

    // If there are attachments, upload them
    if (attachments && attachments.length > 0 && response.data.data) {
      const caseId = response.data.data.id

      // Upload each attachment
      for (const file of attachments) {
        await uploadFile(`/cases/${caseId}/attachments`, file)
      }

      // Get the updated case with attachments
      const updatedResponse = await api.get<ApiResponse<Case>>(`/cases/${caseId}`)
      return updatedResponse.data
    }

    return response.data
  },

  updateCase: async (caseId: string, caseData: Partial<CaseFormData>): Promise<ApiResponse<Case>> => {
    const { attachments, ...caseDataWithoutFiles } = caseData
    const response = await api.put<ApiResponse<Case>>(`/cases/${caseId}`, caseDataWithoutFiles)

    // If there are attachments, upload them
    if (attachments && attachments.length > 0 && response.data.data) {
      // Upload each attachment
      for (const file of attachments) {
        await uploadFile(`/cases/${caseId}/attachments`, file)
      }

      // Get the updated case with attachments
      const updatedResponse = await api.get<ApiResponse<Case>>(`/cases/${caseId}`)
      return updatedResponse.data
    }

    return response.data
  },

  closeCase: async (caseId: string): Promise<ApiResponse<Case>> => {
    const response = await api.put<ApiResponse<Case>>(`/cases/${caseId}/close`)
    return response.data
  },

  deleteAttachment: async (caseId: string, attachmentId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/cases/${caseId}/attachments/${attachmentId}`)
    return response.data
  },
}

