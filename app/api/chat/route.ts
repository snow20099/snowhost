import { NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 })
    }

    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful customer support assistant for SnowHost, a web hosting company that specializes in game server hosting for Minecraft, CS2, FiveM, and ARK.

The user has asked: "${message}"

Provide a helpful, friendly, and concise response. If you don't know specific details about SnowHost's services, you can mention general information about game server hosting or suggest contacting sales for specific pricing.

Keep your response under 3 sentences unless detailed technical information is required.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
      }),
    })

    const data = await response.json()

    const responseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I'm sorry, I couldn't process your request at the moment."

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
