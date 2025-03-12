export enum BidStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
  }
  
  export interface Bid {
    id: string
    caseId: string
    lawyerId: string
    lawyerName: string
    lawyerProfileImage?: string
    amount: number
    proposal: string
    estimatedCompletionTime: string
    status: BidStatus
    createdAt: string
  }
  
  export interface BidFormData {
    amount: number
    proposal: string
    estimatedCompletionTime: string
  }
  
  