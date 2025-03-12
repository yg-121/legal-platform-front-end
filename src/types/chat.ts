export interface Message {
    id: string
    senderId: string
    senderName: string
    senderRole: string
    senderProfileImage?: string
    receiverId: string
    content: string
    attachments?: ChatAttachment[]
    read: boolean
    createdAt: string
  }
  
  export interface ChatAttachment {
    id: string
    fileName: string
    fileUrl: string
    fileType: string
    fileSize: number
  }
  
  export interface ChatUser {
    id: string
    name: string
    role: string
    profileImage?: string
    lastMessage?: string
    lastMessageTime?: string
    unreadCount: number
    online?: boolean
  }
  
  export interface MessageFormData {
    content: string
    attachments?: File[]
  }
  
  