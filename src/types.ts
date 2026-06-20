export interface Chapter {
  id: string;
  title: string;
  content: string; // Structured text content
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverGradient: string; // Tailwind gradient starting and ending colors (e.g. "from-amber-400 to-amber-700")
  coverIcon: string; // Lucide icon name as a string (e.g. "BookOpen", "Sparkles", "Compass")
  category: "Théâtre" | "Conte" | "Fantastique" | "Roman" | "Poésie";
  chapters: Chapter[];
  isCustom?: boolean;
  rating?: number;
  year?: string;
  wordCount?: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterId: string;
  text: string;
  note?: string;
  color: "gold" | "emerald" | "sky" | "rose";
  createdAt: string;
}

export interface ReadingProgress {
  bookId: string;
  currentChapterId: string;
  lastRead: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}
