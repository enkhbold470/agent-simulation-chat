"use client"

import { useState, useCallback } from "react"
import { type FlowNode, getSimulationSteps } from "@/lib/agent-simulation"

export function useAgentSimulation() {
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([])
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [isSimulationActive, setIsSimulationActive] = useState(false)
  const [simulationState, setSimulationState] = useState<string | null>(null)

  const startSimulation = useCallback((prompt: string) => {
    const steps = getSimulationSteps(prompt)
    setFlowNodes(steps)
    setCurrentStep(-1)
    setIsSimulationActive(true)
    setSimulationState("Initializing agent simulation...")

    // Start the simulation process
    setTimeout(() => {
      runSimulation(steps)
    }, 500)
  }, [])

  const runSimulation = useCallback(async (steps: FlowNode[]) => {
    for (let i = 0; i < steps.length; i++) {
      // Update current step
      setCurrentStep(i)

      // Update step status to running
      setFlowNodes((prev) => {
        const updated = [...prev]
        updated[i] = { ...updated[i], status: "running" }
        return updated
      })

      // Update simulation state
      setSimulationState(`Executing: ${steps[i].title}`)

      // Simulate processing time (random between 1-3 seconds)
      const processingTime = Math.floor(Math.random() * 2000) + 1000
      await new Promise((resolve) => setTimeout(resolve, processingTime))

      // Update step status to completed
      setFlowNodes((prev) => {
        const updated = [...prev]
        updated[i] = { ...updated[i], status: "completed" }
        return updated
      })
    }

    // Simulation complete
    setSimulationState("Simulation complete")
    setIsSimulationActive(false)
  }, [])

  const resetSimulation = useCallback(() => {
    setFlowNodes([])
    setCurrentStep(-1)
    setIsSimulationActive(false)
    setSimulationState(null)
  }, [])

  return {
    flowNodes,
    currentStep,
    isSimulationActive,
    simulationState,
    startSimulation,
    resetSimulation,
  }
}
