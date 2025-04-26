"use client"

import { useState, useCallback } from "react"
import { type Message, getSampleResponse } from "@/lib/chat"
import { useAgentSimulation } from "@/hooks/use-agent-simulation"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const { startSimulation } = useAgentSimulation()

  const sendMessage = useCallback(
    async (content: string) => {
      if (isProcessing) return

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        status: "complete",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMessage])

      // Add thinking message from assistant
      const assistantThinkingMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        status: "thinking",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantThinkingMessage])
      setIsProcessing(true)

      // Start the agent simulation
      startSimulation(content)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 4000))

      // Get sample response based on prompt
      const { response, toolCalls } = getSampleResponse(content)

      // Update assistant message with response
      setMessages((prev) => {
        const updated = [...prev]
        const lastIndex = updated.length - 1

        updated[lastIndex] = {
          ...updated[lastIndex],
          content: response,
          status: "complete",
          toolCalls: toolCalls?.map((tool) => ({
            ...tool,
            id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          })),
        }

        return updated
      })

      setIsProcessing(false)
    },
    [isProcessing, startSimulation],
  )

  const resetChat = useCallback(() => {
    setMessages([])
    setIsProcessing(false)
  }, [])

  return {
    messages,
    sendMessage,
    isProcessing,
    resetChat,
  }
}
