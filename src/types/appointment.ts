export enum AppointmentStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
  }
  
  export enum AppointmentType {
    VIRTUAL = "virtual",
    IN_PERSON = "in_person",
    PHONE_CALL = "phone_call",
  }
  
  export interface Appointment {
    id: string
    title: string
    description?: string
    caseId?: string
    clientId: string
    clientName: string
    lawyerId: string
    lawyerName: string
    date: string
    startTime: string
    endTime: string
    status: AppointmentStatus
    type: AppointmentType
    location?: string
    meetingLink?: string
    createdAt: string
    updatedAt: string
  }
  
  export interface AppointmentFormData {
    title: string
    description?: string
    caseId?: string
    date: string
    startTime: string
    endTime: string
    type: AppointmentType
    location?: string
  }
  
  