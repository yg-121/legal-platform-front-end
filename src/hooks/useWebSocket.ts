"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useAuth } from "./useAuth"

interface UseWebSocketOptions {
  onMessage?: (data: any) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  reconnectAttempts?: number
}

export const useWebSocket = (url: string, options: UseWebSocketOptions = {}) => {
  const { onMessage, onOpen, onClose, onError, reconnectInterval = 5000, reconnectAttempts = 5 } = options

  const { token } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null)
  const reconnectCountRef = useRef(0)

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!token) return

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    // Create WebSocket connection with auth token
    const wsUrl = `${url}?token=${token}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
      reconnectCountRef.current = 0
      if (onOpen) onOpen()
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)
        if (onMessage) onMessage(data)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
      if (onClose) onClose()

      // Attempt to reconnect
      if (reconnectCountRef.current < reconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectCountRef.current += 1
          connect()
        }, reconnectInterval)
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      if (onError) onError(error)
    }

    wsRef.current = ws
  }, [token, url, onMessage, onOpen, onClose, onError, reconnectInterval, reconnectAttempts])

  // Connect on mount and when token changes
  useEffect(() => {
    if (token) {
      connect()
    }

    return () => {
      // Clean up on unmount
      if (wsRef.current) {
        wsRef.current.close()
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [token, connect])

  // Send message
  const sendMessage = useCallback(
    (data: any) => {
      if (wsRef.current && isConnected) {
        wsRef.current.send(JSON.stringify(data))
      } else {
        console.error("WebSocket not connected")
      }
    },
    [isConnected],
  )

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
  }
}

