import type { Lesson, Level } from "../../types";
import {
  lessons as legacyLessons,
  topics as legacyTopics,
} from "./legacyLessons";
import stories from "./us-lessons.json";
import audioTimings from "./usAudioTimings.json";

export { levelLabels } from "./legacyLessons";

export const topics = [
  {
    slug: "arrival",
    name: "Những ngày đầu",
    description: "Đọc biển ở sân bay, hỏi tuyến xe và xác nhận điểm đến.",
    icon: "plane",
    color: "blue",
  },
  {
    slug: "daily-life",
    name: "Sinh hoạt hằng ngày",
    description: "Gọi món, phân biệt dùng tại quán và mang đi.",
    icon: "coffee",
    color: "peach",
  },
  {
    slug: "community",
    name: "Hàng xóm & cộng đồng",
    description: "Chào hàng xóm, tham dự potluck và làm thẻ thư viện.",
    icon: "book",
    color: "green",
  },
  {
    slug: "workplace",
    name: "Ngày đầu đi làm",
    description: "Hẹn trao đổi nhanh với đồng nghiệp và xác nhận giờ họp.",
    icon: "briefcase",
    color: "purple",
  },
];

const assetBase = `${import.meta.env.BASE_URL}assets`;

export const lessons: Lesson[] = stories.map((story) => {
  const topic = topics.find(({ slug }) => slug === story.topic);
  const timing = audioTimings[story.id as keyof typeof audioTimings];
  if (!topic || !timing) throw new Error(`Missing lesson data for ${story.id}`);

  return {
    id: story.id,
    slug: story.id,
    title: story.title,
    description: story.culture,
    level: story.level as Level,
    topic: topic.slug,
    duration: timing.duration,
    color: topic.color,
    icon: topic.icon,
    audioUrl: `${assetBase}/audio/${timing.folder}/${story.id}.wav`,
    transcriptUrl: `${assetBase}/transcripts/${story.id}.json`,
    culture: story.culture,
    pronunciation: {
      phrase: story.lines[story.sample][1],
      ipa: story.ipa,
      tip: story.tip,
      start: timing.start,
      end: timing.end,
    },
    questions: story.questions.map((question, index) => ({
      ...question,
      id: `${story.id}-${index + 1}`,
    })),
  };
});

export const allLessons = [...lessons, ...legacyLessons];
export const allTopics = [...topics, ...legacyTopics];
