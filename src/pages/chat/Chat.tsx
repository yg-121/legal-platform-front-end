"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Spinner from "../../components/ui/Spinner"
import Avatar from "../../components/ui/Avatar"
import { useAuth } from "../../hooks/useAuth"
import { useWebSocket } from "../../hooks/useWebSocket"
import { chatService } from "../../services/chatService"
import type { Message, ChatUser, MessageFormData } from "../../types/chat"

const Chat: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>()
  const { user } = useAuth()
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // WebSocket connection for real-time chat
  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    `${process.env.REACT_APP_WS_URL || "ws://localhost:8000"}/chat`,
    {
      onMessage: (data) => {
        if (data.type === "message" && data.message) {
          // Add new message to the chat
          setMessages((prev) => [...prev, data.message])

          // Mark message as read if it's from the selected user
          if (data.message.senderId === selectedUser?.id && !data.message.read) {
            chatService.markAsRead([data.message.id])
          }

          // Update unread count for the sender
          setChatUsers((prev) =>
            prev.map((chatUser) => {
              if (chatUser.id === data.message.senderId) {
                return {
                  ...chatUser,
                  lastMessage: data.message.content,
                  lastMessageTime: data.message.createdAt,
                  unreadCount: selectedUser?.id === chatUser.id ? 0 : chatUser.unreadCount + 1,
                }
              }
              return chatUser
            }),
          )
        }
      },
    },
  )

  // Fetch chat users
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        setIsLoadingUsers(true)
        const response = await chatService.getChatUsers()
        if (response.data) {
          setChatUsers(response.data)

          // If userId is provided in URL, select that user
          if (userId) {
            const userToSelect = response.data.find((u) => u.id === userId)
            if (userToSelect) {
              setSelectedUser(userToSelect)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching chat users:", error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchChatUsers()
  }, [userId])

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
    }
  }, [selectedUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchMessages = async (userId: string) => {
    try {
      setIsLoadingMessages(true)
      const response = await chatService.getChatHistory(userId)
      if (response.data) {
        setMessages(response.data)

        // Mark unread messages as read
        const unreadMessageIds = response.data.filter((m) => !m.read && m.senderId === userId).map((m) => m.id)

        if (unreadMessageIds.length > 0) {
          await chatService.markAsRead(unreadMessageIds)

          // Update unread count for the selected user
          setChatUsers((prev) =>
            prev.map((chatUser) => {
              if (chatUser.id === userId) {
                return {
                  ...chatUser,
                  unreadCount: 0,
                }
              }
              return chatUser
            }),
          )
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleSelectUser = (chatUser: ChatUser) => {
    setSelectedUser(chatUser)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser || !messageInput.trim()) {
      return
    }

    try {
      setIsSendingMessage(true)

      const messageData: MessageFormData = {
        content: messageInput,
      }

      const response = await chatService.sendMessage(selectedUser.id, messageData.content)

      if (response.data) {
        const data = response.data;

        setMessages((prev) => [...prev, data])
        setMessageInput("")

        // Update last message for the selected user
        setChatUsers((prev) =>
          prev.map((chatUser) => {
            if (chatUser.id === selectedUser.id) {
              return {
                ...chatUser,
                lastMessage: data.content,
                lastMessageTime: data.createdAt,
              }
            }
            return chatUser
          }),
        )

        // Send message via WebSocket if connected
        if (isConnected) {
          sendMessage({
            type: "message",
            receiverId: selectedUser.id,
            content: messageData.content,
          })
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSendingMessage(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border">
      {/* Chat Users Sidebar */}
      <div className="w-80 flex-shrink-0 border-r">
        <div className="flex h-16 items-center border-b px-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>

        {isLoadingUsers ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            {chatUsers.length > 0 ? (
              <ul className="divide-y">
                {chatUsers.map((chatUser) => (
                  <li
                    key={chatUser.id}
                    className={`cursor-pointer p-4 hover:bg-muted/50 ${
                      selectedUser?.id === chatUser.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleSelectUser(chatUser)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar src={chatUser.profileImage} fallback={chatUser.name} size="md" />
                        {chatUser.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{chatUser.name}</h3>
                          {chatUser.lastMessageTime && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(chatUser.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm text-muted-foreground">
                            {chatUser.lastMessage || "No messages yet"}
                          </p>
                          {chatUser.unreadCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {chatUser.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No conversations yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex flex-1 flex-col">
        {selectedUser ? (
          <>
            <div className="flex h-16 items-center border-b px-4">
              <div className="flex items-center gap-3">
                <Avatar src={selectedUser.profileImage} fallback={selectedUser.name} size="sm" />
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedUser.online ? "Online" : "Offline"}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner />
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === user?.id
                    const showDate =
                      index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt)

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="my-2 flex justify-center">
                            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {!isCurrentUser && <p className="mb-1 text-xs font-medium">{message.senderName}</p>}
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={`mt-1 text-right text-xs ${
                                isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                              {isCurrentUser && <span className="ml-1">{message.read ? "• Read" : "• Sent"}</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                </div>
              )}
            </div>

            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  fullWidth
                />
                <Button type="submit" isLoading={isSendingMessage}>
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a contact to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat

