import { lessons, levelLabels, topics } from "./lessons";
import type { Lesson } from "../../types";
import type { Expedition, QuestionStage } from "../../types/adventure";

const stagesFor = (selection: Lesson[]): QuestionStage[] =>
  selection.flatMap((lesson) =>
    lesson.questions.map((question) => ({
      kind: "question",
      lesson,
      question,
    })),
  );

const levels = Object.keys(levelLabels) as (keyof typeof levelLabels)[];
export const campaigns: Expedition[] = topics.flatMap((topic) =>
  levels.flatMap((level) => {
    const selection = lessons.filter(
      (lesson) => lesson.topic === topic.slug && lesson.level === level,
    );
    return selection.length
      ? [
          {
            id: `${topic.slug}-${level.toLowerCase()}`,
            kind: "campaign" as const,
            title: `${topic.name} · ${level}`,
            topic: topic.slug,
            stages: stagesFor(selection),
          },
        ]
      : [];
  }),
);

export const campaignTopics = Object.fromEntries(
  topics.map((topic) => [
    topic.slug,
    campaigns
      .filter((campaign) => campaign.topic === topic.slug)
      .map((campaign) => campaign.id),
  ]),
);

export const lessonExpeditions: Expedition[] = lessons.map((lesson) => ({
  id: lesson.id,
  kind: "lesson",
  title: lesson.title,
  stages: stagesFor([lesson]),
}));

export function dailyExpedition(now: number): Expedition {
  const date = new Date(now);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const offset =
    Math.floor(Date.UTC(year, month, day) / 86_400_000) % lessons.length;
  const selection = [0, 1, 3].map(
    (step) => lessons[(offset + step) % lessons.length],
  );
  const stamp = [
    year,
    String(month + 1).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
  return {
    id: `daily-${stamp}`,
    kind: "daily",
    title: "Ải hằng ngày",
    stages: stagesFor(selection),
  };
}

export const runKey = (expedition: Expedition) =>
  `${expedition.kind}:${expedition.id}`;
