"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import DashboardLayout from "../layouts/DashboardLayouts"
import { Send, Paperclip, MoreVertical } from "lucide-react"

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

interface Contact {
  id: number
  name: string
  lastMessage: string
  lastMessageTime: string
  unread: number
  imageUrl: string
}

interface ChatInterfaceProps {
  userName: string
  userRole: "client" | "lawyer" | "admin"
}

export default function ChatInterface({ userName, userRole }: ChatInterfaceProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real application, you would fetch contacts from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockContacts = [
        {
          id: 1,
          name: "Jane Smith",
          lastMessage: "I'll send you the documents tomorrow.",
          lastMessageTime: "10:30 AM",
          unread: 2,
          imageUrl: "/placeholder.svg?height=50&width=50",
        },
        {
          id: 2,
          name: "John Doe",
          lastMessage: "The hearing is scheduled for next week.",
          lastMessageTime: "Yesterday",
          unread: 0,
          imageUrl: "/placeholder.svg?height=50&width=50",
        },
        {
          id: 3,
          name: "Alice Johnson",
          lastMessage: "Please review the contract.",
          lastMessageTime: "Mar 15",
          unread: 1,
          imageUrl: "/placeholder.svg?height=50&width=50",
        },
      ]

      setContacts(mockContacts)
      setSelectedContact(mockContacts[0])
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (selectedContact) {
      // In a real application, you would fetch messages for the selected contact
      // For demo purposes, we'll use mock data
      const mockMessages = [
        {
          id: 1,
          sender: selectedContact.name,
          content: "Hello, how can I help you today?",
          timestamp: "10:00 AM",
          isCurrentUser: false,
        },
        {
          id: 2,
          sender: userName,
          content: "I need help with my property dispute case.",
          timestamp: "10:05 AM",
          isCurrentUser: true,
        },
        {
          id: 3,
          sender: selectedContact.name,
          content: "I understand. Can you provide more details about the dispute?",
          timestamp: "10:10 AM",
          isCurrentUser: false,
        },
        {
          id: 4,
          sender: userName,
          content: "It's regarding the boundary line between my property and my neighbor's.",
          timestamp: "10:15 AM",
          isCurrentUser: true,
        },
        {
          id: 5,
          sender: selectedContact.name,
          content: "I see. Do you have any documentation or surveys of the property?",
          timestamp: "10:20 AM",
          isCurrentUser: false,
        },
        {
          id: 6,
          sender: userName,
          content: "Yes, I have the original deed and a recent survey.",
          timestamp: "10:25 AM",
          isCurrentUser: true,
        },
        {
          id: 7,
          sender: selectedContact.name,
          content: "Great. I'll need to review those documents. Can you send them to me?",
          timestamp: "10:30 AM",
          isCurrentUser: false,
        },
      ]

      setMessages(mockMessages)
    }
  }, [selectedContact, userName])

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (newMessage.trim() === "" || !selectedContact) return

    const newMsg: Message = {
      id: messages.length + 1,
      sender: userName,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isCurrentUser: true,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // In a real application, you would send the message to your API
  }

  const formatDate = (dateString: string) => {
    // This is a simple implementation. In a real app, you might want to use a library like date-fns
    return dateString
  }

  if (loading) {
    return (
      <DashboardLayout userRole={userRole} userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      <div className="flex h-[calc(100vh-10rem)] overflow-hidden bg-white rounded-lg shadow">
        {/* Contacts sidebar */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            <ul className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={contact.imageUrl || "/placeholder.svg"}
                          alt={contact.name}
                        />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                          <p className="text-xs text-gray-500">{contact.lastMessageTime}</p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                      </div>
                    </div>
                    {contact.unread > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                          {contact.unread}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={selectedContact.imageUrl || "/placeholder.svg"}
                    alt={selectedContact.name}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{selectedContact.name}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isCurrentUser ? "text-blue-200" : "text-gray-500"}`}>
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 text-gray-500 hover:text-gray-600"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    className="flex-1 mx-4 border-0 focus:ring-0 text-sm"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

