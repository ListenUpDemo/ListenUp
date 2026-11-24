import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Headphones,
  ListChecks,
  FileText,
  Bookmark,
  Check,
} from "lucide-react";
import { lessons, topics } from "../data/mock/lessons";
import {
  LessonArt,
  LevelBadge,
  Button,
  EmptyState,
  LessonCard,
} from "../components/ui";
import { useApp } from "../app/providers/AppProvider";
export default function LessonDetail() {
  const { slug } = useParams();
  const lesson = lessons.find((l) => l.slug === slug);
  const { bookmarks, toggleBookmark, attempts } = useApp();
  if (!lesson)
    return (
      <EmptyState
        title="Không tìm thấy bài học"
        description="Bài học này chưa có trong thư viện."
        action={
          <Link className="btn btn-primary" to="/lessons">
            Xem bài học
          </Link>
        }
      />
    );
  const completed = attempts.some((a) => a.lessonId === lesson.id);
  return (
    <div className="container page-content">
      <Link className="back-link" to="/lessons">
        <ArrowLeft size={16} /> Thư viện bài nghe
      </Link>
      <div className="detail-grid">
        <div>
          <div className="detail-badges">
            <LevelBadge level={lesson.level} />
            {completed && (
              <span className="badge level-A1">
                <Check size={14} /> Đã hoàn thành
              </span>
            )}
          </div>
          <h1>{lesson.title}</h1>
          <p className="detail-description">{lesson.description}</p>
          <div className="detail-meta">
            <span>
              <Clock3 size={18} />
              {Math.ceil(lesson.duration / 60)} phút
            </span>
            <span>
              <ListChecks size={18} />
              {lesson.questions.length} câu hỏi
            </span>
            <span>
              <FileText size={18} />
              Có transcript
            </span>
          </div>
          <p className="eyebrow">
            {topics.find((t) => t.slug === lesson.topic)?.name}
          </p>
          <div className="detail-actions">
            <Link className="btn btn-primary" to={`/practice/${lesson.id}`}>
              <Headphones size={18} /> Bắt đầu luyện nghe{" "}
              <ArrowRight size={18} />
            </Link>
            <Button
              variant="secondary"
              onClick={() => toggleBookmark(lesson.id)}
              aria-pressed={bookmarks.includes(lesson.id)}
            >
              <Bookmark size={18} />
              {bookmarks.includes(lesson.id) ? "Đã lưu" : "Lưu bài học"}
            </Button>
          </div>
          <small className="muted">
            Audio giọng tổng hợp tiếng Anh · Nội dung mẫu của ListenUp
          </small>
        </div>
        <LessonArt lesson={lesson} big />
      </div>
      <div className="detail-overview card">
        <h2>Trong bài học này</h2>
        <div className="overview-grid">
          <div>
            <Headphones />
            <h3>Lắng nghe chủ động</h3>
            <p>
              Nghe hội thoại, tùy chỉnh tốc độ và tua lại những đoạn bạn cần.
            </p>
          </div>
          <div>
            <ListChecks />
            <h3>Kiểm tra khả năng hiểu</h3>
            <p>
              Trả lời {lesson.questions.length} câu hỏi và xem giải thích cụ thể
              cho từng đáp án.
            </p>
          </div>
          <div>
            <FileText />
            <h3>Học cùng transcript</h3>
            <p>Theo dõi từng câu theo thời gian phát và nhấn để nghe lại.</p>
          </div>
        </div>
      </div>
      <div className="section-heading">
        <h2>Tiếp tục khám phá</h2>
        <Link className="text-link" to="/lessons">
          Tất cả bài học <ArrowRight size={16} />
        </Link>
      </div>
      <div className="lesson-grid">
        {lessons
          .filter((l) => l.id !== lesson.id)
          .slice(0, 3)
          .map((l) => (
            <LessonCard lesson={l} key={l.id} />
          ))}
      </div>
    </div>
  );
}
