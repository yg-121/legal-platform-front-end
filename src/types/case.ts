export enum CaseStatus {
    POSTED = "posted",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    CLOSED = "closed",
  }
  
  export enum CaseCategory {
    FAMILY = "family",
    CRIMINAL = "criminal",
    CIVIL = "civil",
    CORPORATE = "corporate",
    PROPERTY = "property",
    IMMIGRATION = "immigration",
    OTHER = "other",
  }
  
  export interface Case {
    id: string
    title: string
    description: string
    clientId: string
    clientName: string
    lawyerId?: string
    lawyerName?: string
    status: CaseStatus
    category: CaseCategory
    budget?: number
    attachments?: Attachment[]
    createdAt: string
    updatedAt: string
    dueDate?: string
  }
  
  export interface Attachment {
    id: string
    fileName: string
    fileUrl: string
    fileType: string
    fileSize: number
    uploadedAt: string
  }
  
  export interface CaseFilters {
    status?: CaseStatus
    category?: CaseCategory
    search?: string
    page?: number
    limit?: number
  }
  
  export interface CaseFormData {
    title: string
    description: string
    category: CaseCategory
    budget?: number
    dueDate?: string
    attachments?: File[]
  }
  
  