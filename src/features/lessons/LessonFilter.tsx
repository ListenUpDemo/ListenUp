import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../../components/ui";
import { topics, levelLabels } from "../../data/mock/lessons";
export interface Filters {
  search: string;
  level: string;
  topic: string;
}
export default function LessonFilter({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  return (
    <div className="lesson-filters">
      <div className="search-field">
        <Search size={19} />
        <Input
          aria-label="Tìm bài học"
          placeholder="Tìm một bài nghe bạn yêu thích…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <div className="select-field">
        <SlidersHorizontal size={17} />
        <select
          aria-label="Lọc theo trình độ"
          value={filters.level}
          onChange={(e) => onChange({ ...filters, level: e.target.value })}
        >
          <option value="">Tất cả trình độ</option>
          {Object.entries(levelLabels).map(([level, label]) => (
            <option key={level} value={level}>
              {level} · {label}
            </option>
          ))}
        </select>
      </div>
      <select
        className="input"
        aria-label="Lọc theo chủ đề"
        value={filters.topic}
        onChange={(e) => onChange({ ...filters, topic: e.target.value })}
      >
        <option value="">Tất cả chủ đề</option>
        {topics.map((topic) => (
          <option key={topic.slug} value={topic.slug}>
            {topic.name}
          </option>
        ))}
      </select>
    </div>
  );
}
