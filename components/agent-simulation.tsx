"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { useAgentSimulation } from "@/hooks/use-agent-simulation"
import { FlowNode } from "@/components/flow-node"

export function AgentSimulation() {
  const { simulationState, currentStep, flowNodes, isSimulationActive } = useAgentSimulation()

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Agent Simulation</h2>
        {isSimulationActive && (
          <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700 animate-pulse">
            Running
          </Badge>
        )}
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          <AnimatePresence>
            {flowNodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FlowNode node={node} isActive={currentStep === index} isCompleted={currentStep > index} />

                {index < flowNodes.length - 1 && (
                  <motion.div
                    className="flex justify-center my-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ArrowRight className="text-purple-500" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {flowNodes.length === 0 && !isSimulationActive && (
            <Card className="p-6 bg-gray-900/50 border-gray-800">
              <p className="text-gray-400 text-center">Enter a prompt in the chat to start the agent simulation</p>
            </Card>
          )}
        </div>
      </ScrollArea>

      {simulationState && (
        <Card className="mt-4 p-4 bg-gray-900/50 border-gray-800">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Current Status</h3>
          <p className="text-sm text-gray-400">{simulationState}</p>
        </Card>
      )}
    </div>
  )
}
