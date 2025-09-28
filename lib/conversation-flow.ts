interface ConversationContext {
  mood: string | null
  previousTopics: string[]
  sessionStart: string
  messageCount: number
}

export function generateWelcomeMessage(userName: string): string {
  const welcomeMessages = [
    `Hello ${userName}! I'm MindfulBot, your personal wellness companion. How are you feeling today?`,
    `Hi ${userName}! I'm here to listen and support you. What's on your mind right now?`,
    `Welcome back, ${userName}! I'm glad you're here. How has your day been so far?`,
    `Hello ${userName}! I'm MindfulBot, and I'm here to help you with whatever you're going through. How are you doing?`,
  ]

  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
}

export function analyzeMood(message: string): string {
  const positiveWords = [
    "happy",
    "good",
    "great",
    "excellent",
    "wonderful",
    "amazing",
    "fantastic",
    "joy",
    "excited",
    "grateful",
    "blessed",
    "love",
    "perfect",
    "awesome",
  ]
  const negativeWords = [
    "sad",
    "depressed",
    "anxious",
    "worried",
    "stressed",
    "angry",
    "frustrated",
    "upset",
    "down",
    "terrible",
    "awful",
    "hate",
    "angry",
    "mad",
    "furious",
  ]
  const neutralWords = ["okay", "fine", "alright", "normal", "usual", "same", "nothing", "regular"]

  const lowerMessage = message.toLowerCase()

  let positiveCount = 0
  let negativeCount = 0
  let neutralCount = 0

  positiveWords.forEach((word) => {
    if (lowerMessage.includes(word)) positiveCount++
  })

  negativeWords.forEach((word) => {
    if (lowerMessage.includes(word)) negativeCount++
  })

  neutralWords.forEach((word) => {
    if (lowerMessage.includes(word)) neutralCount++
  })

  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    return "positive"
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    return "negative"
  } else {
    return "neutral"
  }
}

export function generateMoodResponse(mood: string, message: string): string {
  switch (mood) {
    case "positive":
      return "I'm so glad to hear you're feeling positive! That's wonderful. What's been contributing to these good feelings?"

    case "negative":
      return "I hear that you're going through a difficult time right now. That takes courage to share. Would you like to talk about what's been weighing on you?"

    case "neutral":
      return "Thank you for sharing how you're feeling. Sometimes neutral is exactly where we need to be. What's been on your mind lately?"

    default:
      return "I'm here to listen to whatever you'd like to share. How can I support you today?"
  }
}

export function generateQuickSuggestions(mood: string): string[] {
  switch (mood) {
    case "positive":
      return [
        "Tell me more about what's going well",
        "How can you maintain this positive energy?",
        "What are you most grateful for today?",
        "Share a recent accomplishment",
      ]

    case "negative":
      return [
        "I'd like to try a breathing exercise",
        "Can you help me process these feelings?",
        "What coping strategies have helped before?",
        "I need some encouragement right now",
      ]

    case "neutral":
      return [
        "Help me check in with my emotions",
        "What self-care do I need today?",
        "I'd like to set a small goal",
        "Tell me something uplifting",
      ]

    default:
      return ["I'm feeling anxious", "I need some motivation", "Help me relax", "I want to talk about my day"]
  }
}

export function saveConversationContext(userId: string, context: ConversationContext) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`conversation_${userId}`, JSON.stringify(context))
  }
}

export function loadConversationContext(userId: string): ConversationContext | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(`conversation_${userId}`)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error loading conversation context:", error)
      }
    }
  }
  return null
}

export function clearConversationContext(userId: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`conversation_${userId}`)
  }
}
