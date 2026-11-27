import type { Attempt, Lesson, Question } from "./index";
import type { Slot } from "../data/mock/adventureItems";

export interface QuestionStage {
  kind: "question";
  lesson: Lesson;
  question: Question;
}

export interface Expedition {
  id: string;
  kind: "campaign" | "daily" | "lesson";
  title: string;
  stages: QuestionStage[];
  topic?: string;
}

export type Loadout = Partial<Record<Slot, string>>;

export interface StageOutcome {
  answer: number;
  correct: boolean;
  coins: number;
  bonus: number;
  chest?: { kind: "potion" | "gear"; itemId: string; opened?: boolean };
}

export interface ExpeditionRun {
  version: string;
  startedAt: number;
  index: number;
  loadout: Loadout;
  eliminated: number[];
  selected?: number;
  outcomes: StageOutcome[];
  finished: boolean;
  attempts: Attempt[];
}

export interface AdventureState {
  health: number;
  nextHeartAt: number | null;
  coins: number;
  inventory: Record<string, number>;
  loadout: Loadout;
  runs: Record<string, ExpeditionRun>;
  clearedCampaigns: string[];
  attempts: Attempt[];
}
