"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, RefreshCw } from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { ChatMessage } from "@/components/chat-message"
import { useAgentSimulation } from "@/hooks/use-agent-simulation"

export function ChatInterface() {
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, isProcessing, resetChat } = useChat()

  const { resetSimulation } = useAgentSimulation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isProcessing) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleReset = () => {
    resetChat()
    resetSimulation()
  }

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Chat</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">Enter a prompt to start the conversation and agent simulation</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your prompt..."
            disabled={isProcessing}
            className="bg-gray-800 border-gray-700 text-gray-200 focus-visible:ring-purple-500"
          />
          <Button
            type="submit"
            disabled={isProcessing || !inputValue.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
