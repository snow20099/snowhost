import { NextResponse } from "next/server"

// The API key is stored server-side and not exposed to the client
const GEMINI_API_KEY = "AIzaSyDC_KDF_iomBQXIIdqDHY4LGm9RHi1gvos"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

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

    // Extract the response text from the Gemini API response
    let responseText = "I'm sorry, I couldn't process your request at the moment."

    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
      responseText = data.candidates[0].content.parts[0].text
    }

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}

