// utils/moodConfig.js - Mood definitions, emojis, colors, suggestions
export const MOODS = {
  happy: {
    emoji: "😊",
    label: "Happy",
    color: "#22c55e",
    bgLight: "#dcfce7",
    bgDark: "#14532d",
    suggestion: "Keep the good vibes flowing! Share your joy with someone.",
    activity: "Call a friend or write in your journal 📝",
    intensity: 8,
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    color: "#60a5fa",
    bgLight: "#dbeafe",
    bgDark: "#1e3a5f",
    suggestion: "It's okay to feel low. Be gentle with yourself today.",
    activity: "Take a short walk outside or watch your favorite show 🌿",
    intensity: 3,
  },
  angry: {
    emoji: "😠",
    label: "Angry",
    color: "#f87171",
    bgLight: "#fee2e2",
    bgDark: "#5f1f1f",
    suggestion: "Your feelings are valid. Let's channel that energy.",
    activity: "Try 5 minutes of deep breathing or a workout 🫁",
    intensity: 6,
  },
  neutral: {
    emoji: "😐",
    label: "Neutral",
    color: "#94a3b8",
    bgLight: "#f1f5f9",
    bgDark: "#1e293b",
    suggestion: "A calm day is a gift. Use it to reset and reflect.",
    activity: "Meditate for 10 minutes or tidy your space ✨",
    intensity: 5,
  },
  tired: {
    emoji: "😴",
    label: "Tired",
    color: "#a78bfa",
    bgLight: "#ede9fe",
    bgDark: "#2e1b5f",
    suggestion: "Rest is productive. Your body is asking for care.",
    activity: "Take a 20-min nap or drink some chamomile tea 🍵",
    intensity: 4,
  },
  anxious: {
    emoji: "😰",
    label: "Anxious",
    color: "#fb923c",
    bgLight: "#ffedd5",
    bgDark: "#5f2d0e",
    suggestion: "You are safe. This feeling will pass.",
    activity: "Try box breathing: in 4, hold 4, out 4, hold 4 📦",
    intensity: 7,
  },
  excited: {
    emoji: "🤩",
    label: "Excited",
    color: "#f59e0b",
    bgLight: "#fef3c7",
    bgDark: "#5f3d0e",
    suggestion: "Your energy is electric! Harness it for something big.",
    activity: "Start that project you've been postponing 🚀",
    intensity: 9,
  },
  grateful: {
    emoji: "🥰",
    label: "Grateful",
    color: "#ec4899",
    bgLight: "#fce7f3",
    bgDark: "#5f1b3a",
    suggestion: "Gratitude multiplies joy. Cherish this feeling.",
    activity: "Write 3 things you're thankful for today 💌",
    intensity: 9,
  },
}

export const MOOD_KEYS = Object.keys(MOODS)

// Motivational quotes for the relaxation section
export const QUOTES = [
  { text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious.", author: "Lori Deschene" },
  { text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", author: "Noam Shpancer" },
  { text: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
  { text: "You are enough just as you are. Each emotion you feel, everything in your life, everything you do or do not do... is enough.", author: "Unknown" },
  { text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.", author: "Unknown" },
  { text: "Sometimes the bravest and most important thing you can do is just show up.", author: "Brene Brown" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Happiness is not the absence of problems, it's the ability to deal with them.", author: "Steve Maraboli" },
]

export const TAGS = ["work", "family", "health", "relationships", "stress", "personal", "growth", "gratitude", "sleep", "exercise"]