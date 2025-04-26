"use client"

import { useState, useCallback } from "react"
import { type Message } from "@/lib/chat"
import { useAgentSimulation } from "@/hooks/use-agent-simulation"
import toast from "react-hot-toast"

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const { startSimulation } = useAgentSimulation()

  const sendMessage = useCallback(
    async (content: string) => {
      if (isProcessing) return

      console.log("Sending message:", content)
      const toastId = toast.loading("Sending message...")

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        status: "complete",
        timestamp: Date.now(),
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)

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

      // Start the agent simulation (based on user prompt, independent of API response for now)
      startSimulation(content)

      try {
        console.debug("Calling API route /api/chat")
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: updatedMessages }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("API request failed:", response.status, errorData)
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const assistantResponse: Partial<Message> = data.message

        console.debug("Received response from API route:", assistantResponse)

        if (!assistantResponse || !assistantResponse.content) {
          console.error("Invalid response structure from API:", data)
          throw new Error("Invalid response from server")
        }

        // Update assistant message with response
        setMessages((prev) => {
          const updated = [...prev]
          const lastIndex = updated.length - 1

          updated[lastIndex] = {
            ...updated[lastIndex],
            content: assistantResponse.content || "",
            status: "complete",
          }
          console.log("Updated assistant message state.")
          return updated
        })
        toast.success("Response received!", { id: toastId })
      } catch (error) {
        console.error("Error sending message or processing response:", error)
        toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, { id: toastId })

        // Optionally remove the thinking message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantThinkingMessage.id))
      } finally {
        setIsProcessing(false)
        console.log("Finished processing message.")
      }
    },
    [isProcessing, startSimulation, messages],
  )

  const resetChat = useCallback(() => {
    console.log("Resetting chat.")
    setMessages([])
    setIsProcessing(false)
    toast.success("Chat reset.")
  }, [])

  return {
    messages,
    sendMessage,
    isProcessing,
    resetChat,
  }
}
