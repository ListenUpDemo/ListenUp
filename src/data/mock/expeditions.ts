import { allLessons, allTopics, lessons, levelLabels, topics } from "./lessons";
import type { Attempt, Lesson } from "../../types";
import type {
  AdventureState,
  Expedition,
  QuestionStage,
} from "../../types/adventure";

const stagesFor = (selection: Lesson[]): QuestionStage[] =>
  selection.flatMap((lesson) =>
    lesson.questions.map((question) => ({
      kind: "question",
      lesson,
      question,
    })),
  );

const levels = Object.keys(levelLabels) as (keyof typeof levelLabels)[];
export const campaigns: Expedition[] = allTopics.flatMap((topic) =>
  levels.flatMap((level) => {
    const selection = allLessons.filter(
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

export const journeyCampaigns = campaigns.filter(({ topic }) =>
  topics.some(({ slug }) => slug === topic),
);

export function getJourneyProgress(
  state: AdventureState,
  earlierAttempts: Attempt[] = [],
) {
  const attempted = new Set(
    [...earlierAttempts, ...state.attempts].map(({ lessonId }) => lessonId),
  );
  const completed = new Set(
    journeyCampaigns
      .filter(
        ({ id, stages }) =>
          state.clearedCampaigns.includes(id) ||
          stages.every(({ lesson }) => attempted.has(lesson.id)),
      )
      .map(({ id }) => id),
  );
  const nextIndex = journeyCampaigns.findIndex(({ id }) => !completed.has(id));
  const lockedCampaigns =
    nextIndex < 0
      ? []
      : journeyCampaigns
          .slice(nextIndex + 1)
          .filter(({ id }) => !completed.has(id));
  const lockedLessons = new Set(
    lockedCampaigns.flatMap(({ stages }) =>
      stages.map(({ lesson }) => lesson.id),
    ),
  );
  return {
    completed,
    next: journeyCampaigns[nextIndex],
    lockedCampaigns: new Set(lockedCampaigns.map(({ id }) => id)),
    lockedLessons,
  };
}

export const lessonExpeditions: Expedition[] = allLessons.map((lesson) => ({
  id: lesson.id,
  kind: "lesson",
  title: lesson.title,
  stages: stagesFor([lesson]),
}));

export function dailyExpedition(
  now: number,
  lockedLessons: ReadonlySet<string>,
  runs: AdventureState["runs"],
): Expedition {
  const date = new Date(now);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const stamp = [
    year,
    String(month + 1).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
  const id = `us-daily-${stamp}`;
  const existing = runs[`daily:${id}`];
  const pool = existing
    ? lessons
    : lessons.filter(({ id }) => !lockedLessons.has(id));
  const offset =
    Math.floor(Date.UTC(year, month, day) / 86_400_000) % pool.length;
  const selection = existing?.dailyLessonIds
    ? existing.dailyLessonIds.flatMap((id) =>
        lessons.filter((lesson) => lesson.id === id),
      )
    : [
        ...new Set(
          [0, 1, pool.length > 3 ? 3 : 2].map(
            (step) => pool[(offset + step) % pool.length],
          ),
        ),
      ];
  return {
    id,
    kind: "daily",
    title: "Luyện tập hằng ngày",
    stages: stagesFor(selection),
  };
}

export const runKey = (expedition: Expedition) =>
  `${expedition.kind}:${expedition.id}`;
