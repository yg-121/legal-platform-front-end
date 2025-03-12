export enum NotificationType {
    CASE_UPDATE = "case_update",
    BID_RECEIVED = "bid_received",
    BID_ACCEPTED = "bid_accepted",
    APPOINTMENT_CREATED = "appointment_created",
    APPOINTMENT_UPDATED = "appointment_updated",
    MESSAGE_RECEIVED = "message_received",
    SYSTEM = "system",
  }
  
  export interface Notification {
    id: string
    userId: string
    type: NotificationType
    title: string
    message: string
    read: boolean
    entityId?: string // ID of related entity (case, bid, appointment, etc.)
    entityType?: string // Type of related entity
    createdAt: string
  }
  
  