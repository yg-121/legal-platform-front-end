"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Info, User, Check, CheckCheck } from "lucide-react"
import PageLayout from "../../components/layouts/PageLayout"

interface Message {
  id: number
  content: string
  timestamp: string
  sender: "user" | "contact"
  status: "sent" | "delivered" | "read"
}

interface Conversation {
  id: number
  contactName: string
  contactRole: "client" | "lawyer"
  contactImage: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
  messages: Message[]
}

interface MessagesPageProps {
  userName: string
  userRole: "client" | "lawyer" | "admin"
}

export default function MessagesPage({ userName, userRole }: MessagesPageProps) {
  const { conversationId } = useParams<{ conversationId: string }>()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockConversations: Conversation[] = [
        {
          id: 1,
          contactName: userRole === "client" ? "Abebe Kebede" : "Sara Tadesse",
          contactRole: userRole === "client" ? "lawyer" : "client",
          contactImage: "/placeholder.svg?height=50&width=50",
          lastMessage: "I'll send you the documents tomorrow.",
          lastMessageTime: "10:30 AM",
          unreadCount: 2,
          online: true,
          messages: [
            {
              id: 1,
              content: `Hello, I'm ${userRole === "client" ? "Abebe Kebede" : "Sara Tadesse"}. How can I help you with your case?`,
              timestamp: "10:00 AM",
              sender: "contact",
              status: "read",
            },
            {
              id: 2,
              content: "I need help with my property dispute case.",
              timestamp: "10:05 AM",
              sender: "user",
              status: "read",
            },
            {
              id: 3,
              content: "I understand. Can you provide more details about the dispute?",
              timestamp: "10:10 AM",
              sender: "contact",
              status: "read",
            },
            {
              id: 4,
              content: "It's regarding the boundary line between my property and my neighbor's.",
              timestamp: "10:15 AM",
              sender: "user",
              status: "read",
            },
            {
              id: 5,
              content: "I see. Do you have any documentation or surveys of the property?",
              timestamp: "10:20 AM",
              sender: "contact",
              status: "read",
            },
            {
              id: 6,
              content: "Yes, I have the original deed and a recent survey.",
              timestamp: "10:25 AM",
              sender: "user",
              status: "read",
            },
            {
              id: 7,
              content: "Great. I'll need to review those documents. Can you send them to me?",
              timestamp: "10:30 AM",
              sender: "contact",
              status: "delivered",
            },
          ],
        },
        {
          id: 2,
          contactName: userRole === "client" ? "Tigist Haile" : "John Smith",
          contactRole: userRole === "client" ? "lawyer" : "client",
          contactImage: "/placeholder.svg?height=50&width=50",
          lastMessage: "The hearing is scheduled for next week.",
          lastMessageTime: "Yesterday",
          unreadCount: 0,
          online: false,
          messages: [
            {
              id: 1,
              content: "Hello, I'm reviewing your contract case.",
              timestamp: "Yesterday, 2:00 PM",
              sender: "contact",
              status: "read",
            },
            {
              id: 2,
              content: "Thank you. Do you need any additional information from me?",
              timestamp: "Yesterday, 2:10 PM",
              sender: "user",
              status: "read",
            },
            {
              id: 3,
              content: "Not at the moment. I've scheduled a hearing for next week.",
              timestamp: "Yesterday, 2:15 PM",
              sender: "contact",
              status: "read",
            },
            {
              id: 4,
              content: "Great, what time should I be available?",
              timestamp: "Yesterday, 2:20 PM",
              sender: "user",
              status: "read",
            },
            {
              id: 5,
              content: "The hearing is scheduled for next week, Tuesday at 10:00 AM.",
              timestamp: "Yesterday, 2:25 PM",
              sender: "contact",
              status: "read",
            },
          ],
        },
        {
          id: 3,
          contactName: userRole === "client" ? "Solomon Tesfaye" : "Meron Alemu",
          contactRole: userRole === "client" ? "lawyer" : "client",
          contactImage: "/placeholder.svg?height=50&width=50",
          lastMessage: "Please review the contract.",
          lastMessageTime: "Mar 15",
          unreadCount: 1,
          online: true,
          messages: [
            {
              id: 1,
              content: "I've drafted the contract as we discussed.",
              timestamp: "Mar 15, 9:00 AM",
              sender: "contact",
              status: "read",
            },
            {
              id: 2,
              content: "Thank you. I'll take a look at it.",
              timestamp: "Mar 15, 9:15 AM",
              sender: "user",
              status: "read",
            },
            {
              id: 3,
              content: "Please review it and let me know if you have any questions or need any changes.",
              timestamp: "Mar 15, 9:20 AM",
              sender: "contact",
              status: "sent",
            },
          ],
        },
      ]

      setConversations(mockConversations)

      // Set the first conversation as selected by default, or the one from URL
      if (conversationId) {
        const conversation = mockConversations.find((c) => c.id.toString() === conversationId)
        if (conversation) {
          setSelectedConversation(conversation)
        } else {
          setSelectedConversation(mockConversations[0])
        }
      } else {
        setSelectedConversation(mockConversations[0])
      }

      setLoading(false)
    }, 1000)
  }, [userRole, conversationId])

  useEffect(() => {
    // Scroll to bottom of messages when conversation changes or new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (newMessage.trim() === "" || !selectedConversation) return

    const newMsg: Message = {
      id: selectedConversation.messages.length + 1,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "user",
      status: "sent",
    }

    // Update the selected conversation with the new message
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      lastMessage: newMessage,
      lastMessageTime: "Just now",
    }

    // Update the conversations list
    setConversations(conversations.map((conv) => (conv.id === selectedConversation.id ? updatedConversation : conv)))

    // Update the selected conversation
    setSelectedConversation(updatedConversation)

    // Clear the input
    setNewMessage("")

    // In a real application, you would send the message to your API
  }

  const handleSelectConversation = (conversation: Conversation) => {
    // Mark messages as read
    const updatedConversation = {
      ...conversation,
      unreadCount: 0,
    }

    // Update the conversations list
    setConversations(conversations.map((conv) => (conv.id === conversation.id ? updatedConversation : conv)))

    // Set the selected conversation
    setSelectedConversation(updatedConversation)
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.contactName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatMessageTime = (timestamp: string) => {
    // This is a simple implementation. In a real app, you might want to use a library like date-fns
    return timestamp
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <PageLayout userRole={userRole} userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout userRole={userRole} userName={userName}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
          <p className="mt-2 text-blue-100">Communicate with your {userRole === "client" ? "lawyers" : "clients"}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex h-[calc(80vh-2rem)] flex-col md:flex-row">
            {/* Conversations sidebar */}
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {filteredConversations.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredConversations.map((conversation) => (
                      <li
                        key={conversation.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedConversation?.id === conversation.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="relative px-4 py-4">
                          <div className="flex items-center">
                            <div className="relative flex-shrink-0">
                              <img
                                className="h-12 w-12 rounded-full object-cover"
                                src={conversation.contactImage || "/placeholder.svg"}
                                alt={conversation.contactName}
                              />
                              {conversation.online && (
                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                              )}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">{conversation.contactName}</p>
                                <p className="text-xs text-gray-500">{conversation.lastMessageTime}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                                {conversation.unreadCount > 0 && (
                                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1 capitalize">{conversation.contactRole}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <User className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500 text-center">No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className="w-full md:w-2/3 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={selectedConversation.contactImage || "/placeholder.svg"}
                          alt={selectedConversation.contactName}
                        />
                        {selectedConversation.online && (
                          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{selectedConversation.contactName}</p>
                        <p className="text-xs text-gray-500 capitalize">{selectedConversation.contactRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                        <Video className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                        <Info className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.sender === "contact" && (
                            <img
                              className="h-8 w-8 rounded-full mr-2 self-end"
                              src={selectedConversation.contactImage || "/placeholder.svg"}
                              alt={selectedConversation.contactName}
                            />
                          )}
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-800 border border-gray-200"
                            }`}
                          >
                            <p>{message.content}</p>
                            <div
                              className={`text-xs mt-1 flex items-center justify-end ${
                                message.sender === "user" ? "text-blue-200" : "text-gray-500"
                              }`}
                            >
                              <span>{formatMessageTime(message.timestamp)}</span>
                              {message.sender === "user" && (
                                <span className="ml-1">{getStatusIcon(message.status)}</span>
                              )}
                            </div>
                          </div>
                          {message.sender === "user" && (
                            <img
                              className="h-8 w-8 rounded-full ml-2 self-end"
                              src="/placeholder.svg?height=50&width=50"
                              alt={userName}
                            />
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <button
                        type="button"
                        className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 mx-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <User className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-500 text-center">Select a conversation from the list to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

