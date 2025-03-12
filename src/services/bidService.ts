import api from "./api"
import type { Bid, BidFormData } from "../types/bid"
import type { ApiResponse } from "../types/api"

export const bidService = {
  getBidsForCase: async (caseId: string): Promise<ApiResponse<Bid[]>> => {
    const response = await api.get<ApiResponse<Bid[]>>(`/bids/case/${caseId}`)
    return response.data
  },

  getMyBids: async (): Promise<ApiResponse<Bid[]>> => {
    const response = await api.get<ApiResponse<Bid[]>>("/bids/my-bids")
    return response.data
  },

  createBid: async (caseId: string, bidData: BidFormData): Promise<ApiResponse<Bid>> => {
    const response = await api.post<ApiResponse<Bid>>(`/bids/case/${caseId}`, bidData)
    return response.data
  },

  updateBid: async (bidId: string, bidData: Partial<BidFormData>): Promise<ApiResponse<Bid>> => {
    const response = await api.put<ApiResponse<Bid>>(`/bids/${bidId}`, bidData)
    return response.data
  },

  acceptBid: async (bidId: string): Promise<ApiResponse<Bid>> => {
    const response = await api.put<ApiResponse<Bid>>(`/bids/accept/${bidId}`)
    return response.data
  },

  rejectBid: async (bidId: string): Promise<ApiResponse<Bid>> => {
    const response = await api.put<ApiResponse<Bid>>(`/bids/reject/${bidId}`)
    return response.data
  },

  deleteBid: async (bidId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/bids/${bidId}`)
    return response.data
  },
}

