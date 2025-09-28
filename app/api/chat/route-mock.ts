// Mock Chat API for testing when OpenAI quota is exceeded
export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage.content.toLowerCase()

    // Mock mental health responses based on keywords
    let response = ""
    
    if (userMessage.includes("anxious") || userMessage.includes("anxiety")) {
      response = "I hear that you're feeling anxious, and that's completely understandable. Anxiety is a natural response, and you're not alone in feeling this way. Have you tried any breathing exercises or grounding techniques that help you feel more centered?"
    } else if (userMessage.includes("sad") || userMessage.includes("depressed") || userMessage.includes("down")) {
      response = "I'm sorry you're feeling down right now. Your feelings are valid, and it takes courage to reach out. Sometimes when we're feeling low, small self-care activities can help - like taking a warm bath, listening to music, or reaching out to a friend. What usually helps you feel a little better?"
    } else if (userMessage.includes("stress") || userMessage.includes("overwhelmed")) {
      response = "It sounds like you're dealing with a lot of stress right now. Feeling overwhelmed is your mind's way of telling you that you need some support. Try breaking things down into smaller, manageable steps. What's one small thing you could do today to reduce some of that pressure?"
    } else if (userMessage.includes("sleep") || userMessage.includes("tired")) {
      response = "Sleep challenges can really affect how we feel during the day. Good sleep hygiene can make a big difference - like keeping a consistent bedtime, limiting screen time before bed, and creating a calming bedtime routine. What's your current sleep routine like?"
    } else {
      response = "Thank you for sharing that with me. I'm here to listen and support you. It's important to acknowledge your feelings and know that seeking support is a sign of strength. How are you feeling right now, and what would be most helpful for you today?"
    }

    // Simulate streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const words = response.split(' ')
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
    console.error("Mock Chat API error:", error)
    return new Response("I'm here to support you, but I'm having a technical issue right now. Please try again in a moment.", { status: 500 })
  }
}
