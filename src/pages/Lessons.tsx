import {
  useSearchParams,
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { lessons, topics } from "../data/mock/lessons";
import { LessonCard, EmptyState, Button } from "../components/ui";
import LessonFilter from "../features/lessons/LessonFilter";
import { normalizeSearch } from "../utils/scoring.mjs";
export default function Lessons() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const topic = topics.find((t) => t.slug === slug);
  const [params, setParams] = useSearchParams();
  const filters = {
    search: params.get("q") || "",
    level: params.get("level") || "",
    topic: topic?.slug || params.get("topic") || "",
  };
  const filtered = lessons.filter(
    (l) =>
      (!filters.search ||
        normalizeSearch(`${l.title} ${l.description}`).includes(
          normalizeSearch(filters.search),
        )) &&
      (!filters.level || l.level === filters.level) &&
      (!filters.topic || l.topic === filters.topic),
  );
  if (slug && !topic)
    return (
      <div className="container section">
        <EmptyState
          title="Không tìm thấy chủ đề"
          description="Hãy khám phá các chủ đề hiện có."
          action={
            <Link to="/topics" className="btn btn-primary">
              Xem chủ đề
            </Link>
          }
        />
      </div>
    );
  return (
    <div className="container page-content">
      {topic && (
        <Link className="back-link" to="/topics">
          <ArrowLeft size={16} /> Tất cả chủ đề
        </Link>
      )}
      <div className="page-heading">
        <h1>
          {topic?.name || "Thư viện bài nghe"}
          <span className="heading-dot">.</span>
        </h1>
        <p>
          {topic?.description ||
            "Luyện nghe và phát âm tiếng Anh qua các tình huống đời thường."}
        </p>
      </div>
      <LessonFilter
        filters={filters}
        onChange={(next) => {
          const p = new URLSearchParams();
          if (next.search) p.set("q", next.search);
          if (next.level) p.set("level", next.level);
          if (next.topic && !topic) p.set("topic", next.topic);
          if (topic && next.topic !== topic.slug) {
            navigate(
              `/lessons?${new URLSearchParams({ topic: next.topic, level: next.level, q: next.search })}`,
            );
            return;
          }
          setParams(p, { replace: true });
        }}
      />
      <div className="results-label">
        <strong>{filtered.length} bài học</strong>
        <span>Audio mẫu · Có transcript & bài tập</span>
      </div>
      {filtered.length ? (
        <div className="lesson-grid">
          {filtered.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa tìm thấy bài phù hợp"
          description="Thử từ khóa khác hoặc chọn lại bộ lọc nhé."
          action={
            <Button variant="secondary" onClick={() => setParams({})}>
              Xóa bộ lọc
            </Button>
          }
        />
      )}
    </div>
  );
}
