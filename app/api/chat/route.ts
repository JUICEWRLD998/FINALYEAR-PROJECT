import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 })
    }

  // Get the Gemini Pro model (if supported by API key)
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create a mental health focused system prompt
    const systemPrompt = `You are a compassionate AI mental health support assistant. You provide empathetic, supportive responses while being careful not to give medical advice. Your role is to:

- Listen actively and validate feelings
- Provide emotional support and encouragement
- Suggest healthy coping strategies and resources
- Encourage professional help when appropriate
- Always be warm, non-judgmental, and supportive

Important guidelines:
- Never diagnose or provide medical advice
- Always encourage seeking professional help for serious concerns
- Be empathetic and understanding
- Provide practical, evidence-based coping strategies
- Keep responses conversational and supportive (not too clinical)

Please respond to the user's message with care and compassion.`

    // Convert messages to Gemini format and include system prompt
    const lastUserMessage = messages[messages.length - 1].content
    const conversationHistory = messages.slice(0, -1).map((msg: any) => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n')

    const prompt = `${systemPrompt}

Previous conversation:
${conversationHistory}

User: ${lastUserMessage}`

    // Generate response using Gemini
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const words = text.split(' ')
        let index = 0
        
        const interval = setInterval(() => {
          if (index < words.length) {
            const chunk = index === 0 ? words[index] : ' ' + words[index]
            controller.enqueue(encoder.encode(chunk))
            index++
          } else {
            clearInterval(interval)
            controller.close()
          }
        }, 50) // 50ms delay between words for realistic typing effect
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })

  } catch (error) {
    console.error("Gemini Chat API error:", error)
    
    // Fallback response if Gemini fails
    const fallbackResponse = "I'm here to support you, but I'm having a technical issue connecting right now. Your feelings are valid and important. Please try again in a moment, or if you're in crisis, please reach out to a mental health professional or crisis hotline."
    
    const encoder = new TextEncoder()
    return new Response(encoder.encode(fallbackResponse), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
      status: 500
    })
  }
}
