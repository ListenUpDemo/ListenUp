import type { Question } from "../types";
export function gradeAnswers(
  questions: Question[],
  answers: Record<string, number>,
): number;
export function normalizeSearch(value: string): string;
