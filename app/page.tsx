import { AgentSimulation } from "@/components/agent-simulation"
import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row h-screen bg-gray-950">
      <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-gray-800">
        <AgentSimulation />
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  )
}
