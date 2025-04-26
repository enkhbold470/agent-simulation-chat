"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Bot, ChevronDown, ChevronUp, PenToolIcon as Tool } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Message, ToolCall } from "@/lib/chat"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [isToolCallsExpanded, setIsToolCallsExpanded] = useState(false)

  const toggleToolCalls = () => {
    setIsToolCallsExpanded(!isToolCallsExpanded)
  }

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} gap-3 max-w-[85%]`}>
        <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-purple-700" : "bg-blue-700"}`}>
          {message.role === "user" ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
        </Avatar>

        <div className="space-y-2">
          <Card
            className={`p-3 ${
              message.role === "user" ? "bg-purple-900/30 border-purple-800" : "bg-gray-800 border-gray-700"
            }`}
          >
            {message.status === "thinking" ? (
              <div className="flex items-center gap-2 text-gray-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            ) : (
              <div className="text-gray-200 whitespace-pre-wrap">{message.content}</div>
            )}
          </Card>

          {message.toolCalls && message.toolCalls.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleToolCalls}
                className="text-xs text-gray-400 hover:text-gray-300 p-0 h-auto"
              >
                <span className="flex items-center gap-1">
                  {isToolCallsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {message.toolCalls.length} tool call{message.toolCalls.length > 1 ? "s" : ""}
                </span>
              </Button>

              <AnimatePresence>
                {isToolCallsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 mt-2"
                  >
                    {message.toolCalls.map((toolCall) => (
                      <ToolCallItem key={toolCall.id} toolCall={toolCall} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToolCallItem({ toolCall }: { toolCall: ToolCall }) {
  return (
    <Card className="p-2 bg-gray-850 border-gray-700 text-xs">
      <div className="flex items-center gap-2 mb-1">
        <Tool className="h-3 w-3 text-blue-400" />
        <span className="font-medium text-blue-400">{toolCall.name}</span>
        <Badge
          variant="outline"
          className={`
            text-[10px] px-1 py-0 h-4
            ${toolCall.status === "running" ? "bg-blue-900/30 text-blue-300 border-blue-700" : ""}
            ${toolCall.status === "completed" ? "bg-green-900/30 text-green-300 border-green-700" : ""}
            ${toolCall.status === "failed" ? "bg-red-900/30 text-red-300 border-red-700" : ""}
          `}
        >
          {toolCall.status}
        </Badge>
      </div>

      {toolCall.input && (
        <div className="mb-1">
          <span className="text-gray-400">Input: </span>
          <span className="text-gray-300">{JSON.stringify(toolCall.input)}</span>
        </div>
      )}

      {toolCall.output && (
        <div>
          <span className="text-gray-400">Output: </span>
          <span className="text-gray-300">
            {typeof toolCall.output === "string" ? toolCall.output : JSON.stringify(toolCall.output)}
          </span>
        </div>
      )}
    </Card>
  )
}
