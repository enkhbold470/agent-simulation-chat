export type MessageRole = "user" | "assistant" | "system"
export type MessageStatus = "complete" | "thinking"
export type ToolCallStatus = "running" | "completed" | "failed"

export interface ToolCall {
  id: string
  name: string
  status: ToolCallStatus
  input?: any
  output?: any
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  status: MessageStatus
  timestamp: number
  toolCalls?: ToolCall[]
}

// Sample responses for different prompts
export const sampleResponses: Record<
  string,
  {
    response: string
    toolCalls?: ToolCall[]
  }
> = {
  "summarize latest news about spacex": {
    response:
      "Here's a summary of the latest SpaceX news:\n\n1. SpaceX successfully launched another batch of Starlink satellites yesterday, bringing the total constellation size to over 5,000 satellites.\n\n2. The company announced plans for a new Starship test flight next month, aiming to achieve orbital velocity.\n\n3. SpaceX and NASA are finalizing preparations for the next crew rotation mission to the International Space Station, scheduled for launch in two weeks.",
    toolCalls: [
      {
        id: "tool-1",
        name: "web-search",
        status: "completed",
        input: { query: "latest SpaceX news" },
        output: "Found 15 recent news articles about SpaceX launches and announcements",
      },
      {
        id: "tool-2",
        name: "summarize-document",
        status: "completed",
        input: { text: "Multiple news articles about SpaceX" },
        output: "Summary of key SpaceX developments from the past week",
      },
    ],
  },
  "create a marketing plan for a new product": {
    response:
      "# Marketing Plan for New Product\n\n## Executive Summary\nThis marketing plan outlines a comprehensive strategy for launching your new product, focusing on digital channels, content marketing, and strategic partnerships.\n\n## Target Audience\nBased on market research, your primary audience consists of tech-savvy professionals aged 25-45 with disposable income and interest in innovative solutions.\n\n## Marketing Channels\n1. **Social Media**: Focus on LinkedIn, Instagram, and Twitter with targeted ads\n2. **Content Marketing**: Blog posts, case studies, and video tutorials\n3. **Email Marketing**: Nurture campaigns for leads and existing customers\n4. **Partnerships**: Collaborate with complementary brands\n\n## Budget Allocation\n- Digital Advertising: 40%\n- Content Creation: 25%\n- Partnerships & Events: 20%\n- Analytics & Tools: 15%\n\n## Timeline\n- Pre-launch (2 months): Build anticipation with teasers\n- Launch (1 month): Heavy promotion across all channels\n- Post-launch (3 months): Optimization based on performance data\n\nI recommend starting with a soft launch to gather initial feedback before the full market rollout.",
    toolCalls: [
      {
        id: "tool-1",
        name: "market-research",
        status: "completed",
        input: { industry: "technology", product_type: "new product" },
        output: "Market size: $4.2B, Growth rate: 12% YoY, Key competitors: 5",
      },
      {
        id: "tool-2",
        name: "competitor-analysis",
        status: "completed",
        input: { market: "technology", top_competitors: 5 },
        output: "Analysis of pricing strategies, marketing channels, and positioning",
      },
      {
        id: "tool-3",
        name: "budget-calculator",
        status: "completed",
        input: { market_size: "medium", channels: ["digital", "content", "partnerships"] },
        output: "Recommended budget allocation across marketing channels",
      },
    ],
  },
}

// Helper function to get a sample response based on prompt
export function getSampleResponse(prompt: string): {
  response: string
  toolCalls?: ToolCall[]
} {
  const lowerPrompt = prompt.toLowerCase()

  // Check if we have a predefined response for this prompt
  for (const key in sampleResponses) {
    if (lowerPrompt.includes(key)) {
      return sampleResponses[key]
    }
  }

  // Return a generic response
  return {
    response:
      "I've analyzed your request and gathered the relevant information. Here's what I found based on the latest data and best practices in this area.",
    toolCalls: [
      {
        id: "tool-1",
        name: "information-retrieval",
        status: "completed",
        input: { query: prompt },
        output: "Retrieved relevant information from knowledge base",
      },
    ],
  }
}
