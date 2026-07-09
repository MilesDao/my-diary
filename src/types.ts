export type MoodType = 'happy' | 'serene' | 'thoughtful' | 'melancholic' | 'nostalgic' | 'excited' | 'tired';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiaryMetadata {
  title: string;
  tagline: string;
  authorName: string;
  avatarUrl: string;
}

export interface MoodConfig {
  type: MoodType;
  label: string;
  emoji: string;
  color: string; // Tailwind bg-color or text-color
  border: string;
}

export const MOODS: MoodConfig[] = [
  { type: 'happy', label: 'Vui vẻ', emoji: '😊', color: 'bg-amber-100 text-amber-800', border: 'border-amber-300' },
  { type: 'serene', label: 'Yên bình', emoji: '🍃', color: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-300' },
  { type: 'thoughtful', label: 'Suy tư', emoji: '💭', color: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-300' },
  { type: 'melancholic', label: 'U sầu', emoji: '🌧️', color: 'bg-blue-100 text-blue-800', border: 'border-blue-300' },
  { type: 'nostalgic', label: 'Hoài niệm', emoji: '📜', color: 'bg-stone-200 text-stone-800', border: 'border-stone-400' },
  { type: 'excited', label: 'Hào hứng', emoji: '✨', color: 'bg-rose-100 text-rose-800', border: 'border-rose-300' },
  { type: 'tired', label: 'Mệt mỏi', emoji: '💤', color: 'bg-slate-200 text-slate-800', border: 'border-slate-400' }
];

export interface BookReview {
  id: string;
  title: string;       // Book title
  author: string;      // Author
  coverUrl?: string;   // Optional cover image url
  rating: number;      // Rating from 1 to 5 stars
  reviewContent: string; // The review text
  dateFinished: string;  // Date finished (YYYY-MM-DD)
  tags: string[];      // Book tags / genres
  bookUrl?: string;    // Optional book info/purchase link
  createdAt: string;
  updatedAt: string;
}
