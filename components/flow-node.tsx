"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, PenToolIcon as Tool, Search, FileText, Brain } from "lucide-react"
import type { FlowNodeType } from "@/lib/agent-simulation"

interface FlowNodeProps {
  node: {
    id: string
    type: FlowNodeType
    title: string
    description: string
    status: "pending" | "running" | "completed" | "failed"
  }
  isActive: boolean
  isCompleted: boolean
}

export function FlowNode({ node, isActive, isCompleted }: FlowNodeProps) {
  const getIcon = () => {
    switch (node.type) {
      case "thinking":
        return <Brain className="h-5 w-5" />
      case "tool":
        return <Tool className="h-5 w-5" />
      case "search":
        return <Search className="h-5 w-5" />
      case "summarize":
        return <FileText className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getStatusIcon = () => {
    switch (node.status) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getBorderColor = () => {
    if (isActive) return "border-blue-500"
    if (isCompleted) return "border-green-500/50"
    return "border-gray-700"
  }

  const getBackgroundColor = () => {
    if (isActive) return "bg-blue-950/30"
    return "bg-gray-900/50"
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className={`p-4 ${getBackgroundColor()} ${getBorderColor()} transition-colors duration-300`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${isActive ? "bg-blue-900/50" : "bg-gray-800"}`}>{getIcon()}</div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">{node.title}</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`
                    ${node.status === "running" ? "bg-blue-900/30 text-blue-300 border-blue-700" : ""}
                    ${node.status === "completed" ? "bg-green-900/30 text-green-300 border-green-700" : ""}
                    ${node.status === "failed" ? "bg-red-900/30 text-red-300 border-red-700" : ""}
                    ${node.status === "pending" ? "bg-gray-800 text-gray-300 border-gray-700" : ""}
                  `}
                >
                  <span className="flex items-center gap-1">
                    {getStatusIcon()}
                    {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                  </span>
                </Badge>
              </div>
            </div>

            <p className="mt-1 text-sm text-gray-400">{node.description}</p>

            {isActive && node.status === "running" && (
              <motion.div
                className="w-full h-1 bg-gray-800 mt-3 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
