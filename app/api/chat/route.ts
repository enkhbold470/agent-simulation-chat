import OpenAI from "openai"
import { type NextRequest, NextResponse } from "next/server"
import { type Message } from "@/lib/chat" // Assuming Message type is defined here

// Ensure the OPENAI_API_KEY is set in environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "edge" // Optional: Use edge runtime for lower latency

export async function POST(req: NextRequest) {
  console.debug("API route /api/chat received POST request")
  try {
    const body = await req.json()
    const messages: Message[] = body.messages

    if (!messages || messages.length === 0) {
      console.warn("API route received empty messages array")
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    console.debug("Messages received:", messages)

    // Prepare messages for OpenAI API (only include role and content)
    const openAIMessages = messages.map(({ role, content }) => ({ role, content }))

    console.log("Sending request to OpenAI API with model gpt-4o...")
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o", // Use the gpt-4o model
      messages: openAIMessages,
      // Add other parameters like temperature, max_tokens if needed
      // stream: true, // Consider using streaming for better UX later
    })

    console.log("Received response from OpenAI API.")
    console.debug("OpenAI response:", chatCompletion)

    const assistantResponse = chatCompletion.choices[0]?.message?.content

    if (!assistantResponse) {
      console.error("No response content received from OpenAI.")
      return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 })
    }

    // Construct the message object to send back to the client
    const responseMessage: Partial<Message> = {
      role: "assistant",
      content: assistantResponse,
      // Note: We are not handling tool calls from the API in this basic setup
    }

    console.debug("Sending response back to client:", responseMessage)
    return NextResponse.json({ message: responseMessage })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 