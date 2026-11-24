export type Level = "A1" | "A2" | "B1" | "B2";
export interface TranscriptLine {
  start: number;
  end: number;
  speaker: string;
  text: string;
}
export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}
export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: Level;
  topic: string;
  duration: number;
  color: string;
  icon: string;
  audioUrl: string;
  transcriptUrl: string;
  questions: Question[];
}
export interface Attempt {
  id: string;
  lessonId: string;
  answers: Record<string, number>;
  score: number;
  total: number;
  completedAt: string;
  seconds: number;
}
export interface Profile {
  name: string;
  email: string;
  goal: number;
}
