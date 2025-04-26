export type FlowNodeType = "thinking" | "tool" | "search" | "summarize" | "decision"

export interface FlowNode {
  id: string
  type: FlowNodeType
  title: string
  description: string
  status: "pending" | "running" | "completed" | "failed"
  details?: string
}

// Example simulation steps for different prompts
export const simulationSteps: Record<string, FlowNode[]> = {
  "summarize latest news about spacex": [
    {
      id: "step-1",
      type: "thinking",
      title: "Planning",
      description: "Determining the best approach to find SpaceX news",
      status: "pending",
    },
    {
      id: "step-2",
      type: "search",
      title: "Web Search",
      description: "Searching for latest SpaceX news articles",
      status: "pending",
    },
    {
      id: "step-3",
      type: "thinking",
      title: "Analyzing Results",
      description: "Reviewing search results for relevance",
      status: "pending",
    },
    {
      id: "step-4",
      type: "summarize",
      title: "Summarization",
      description: "Creating a concise summary of the latest SpaceX news",
      status: "pending",
    },
  ],
  "create a marketing plan for a new product": [
    {
      id: "step-1",
      type: "thinking",
      title: "Understanding Request",
      description: "Analyzing the marketing plan requirements",
      status: "pending",
    },
    {
      id: "step-2",
      type: "tool",
      title: "Market Research",
      description: "Gathering market data and trends",
      status: "pending",
    },
    {
      id: "step-3",
      type: "thinking",
      title: "Strategy Development",
      description: "Formulating marketing strategies based on research",
      status: "pending",
    },
    {
      id: "step-4",
      type: "tool",
      title: "Competitor Analysis",
      description: "Analyzing competitor strategies and positioning",
      status: "pending",
    },
    {
      id: "step-5",
      type: "summarize",
      title: "Plan Creation",
      description: "Creating a comprehensive marketing plan document",
      status: "pending",
    },
  ],
  default: [
    {
      id: "step-1",
      type: "thinking",
      title: "Understanding Request",
      description: "Analyzing the user's request",
      status: "pending",
    },
    {
      id: "step-2",
      type: "tool",
      title: "Information Gathering",
      description: "Collecting relevant information",
      status: "pending",
    },
    {
      id: "step-3",
      type: "thinking",
      title: "Processing Information",
      description: "Analyzing and processing the gathered information",
      status: "pending",
    },
    {
      id: "step-4",
      type: "summarize",
      title: "Response Generation",
      description: "Creating a comprehensive response",
      status: "pending",
    },
  ],
}

// Helper function to get simulation steps based on prompt
export function getSimulationSteps(prompt: string): FlowNode[] {
  const lowerPrompt = prompt.toLowerCase()

  // Check if we have predefined steps for this prompt
  for (const key in simulationSteps) {
    if (lowerPrompt.includes(key)) {
      return JSON.parse(JSON.stringify(simulationSteps[key])) // Deep clone
    }
  }

  // Return default steps
  return JSON.parse(JSON.stringify(simulationSteps.default)) // Deep clone
}
