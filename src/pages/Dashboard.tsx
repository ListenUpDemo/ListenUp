import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Headphones,
  Target,
  BookOpen,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useApp } from "../app/providers/AppProvider";
import { lessons } from "../data/mock/lessons";
import { LessonCard, StatCard } from "../components/ui";
import ProgressChart from "../features/progress/ProgressChart";
export default function Dashboard() {
  const { attempts, profile } = useApp();
  const isProgress = useLocation().pathname === "/progress";
  const unique = new Set(attempts.map((a) => a.lessonId)).size;
  const total = attempts.reduce((n, a) => n + a.total, 0);
  const score = attempts.reduce((n, a) => n + a.score, 0);
  const minutes = Math.floor(attempts.reduce((n, a) => n + a.seconds, 0) / 60);
  const next =
    lessons.find((l) => !attempts.some((a) => a.lessonId === l.id)) ||
    lessons[0];
  return (
    <>
      <div className="page-heading dashboard-heading">
        <span className="eyebrow">MỖI NGÀY MỘT BƯỚC TIẾN</span>
        <h1>
          {isProgress
            ? "Tiến độ học tập"
            : `Chào ${profile.name}, cùng nghe nhé!`}
        </h1>
        <p>
          {isProgress
            ? "Nhìn lại những gì bạn đã làm được và tiếp tục hành trình."
            : "Dành một chút thời gian cho tiếng Anh hôm nay."}
        </p>
      </div>
      <div className="stats-grid">
        <StatCard
          icon={<BookOpen size={21} />}
          label="Bài đã hoàn thành"
          value={unique}
          note={`Trong ${lessons.length} bài học hiện có`}
        />
        <StatCard
          icon={<Target size={21} />}
          label="Độ chính xác"
          value={`${total ? Math.round((score / total) * 100) : 0}%`}
          note={`${score}/${total} câu trả lời đúng`}
        />
        <StatCard
          icon={<Clock3 size={21} />}
          label="Thời gian làm bài"
          value={`${minutes} phút`}
          note="Tổng thời gian các lượt đã nộp"
        />
      </div>
      <ProgressChart attempts={attempts} />
      {!isProgress && (
        <div className="dashboard-banner">
          <div>
            <span className="eyebrow">
              <Sparkles size={15} /> GỢI Ý DÀNH CHO BẠN
            </span>
            <h2>{next.title}</h2>
            <p>Một cuộc hội thoại nhỏ đang chờ bạn.</p>
            <Link className="btn btn-primary" to={`/practice/${next.id}`}>
              Luyện nghe ngay <ArrowRight size={17} />
            </Link>
          </div>
          <Headphones size={108} strokeWidth={1} />
        </div>
      )}
      <div className="section-heading">
        <h2>{isProgress ? "Lịch sử luyện tập" : "Hoạt động gần đây"}</h2>
        <span className="muted">{attempts.length} lượt hoàn thành</span>
      </div>
      {attempts.length ? (
        <div className="history-list">
          {[...attempts].reverse().map((a) => {
            const lesson = lessons.find((l) => l.id === a.lessonId);
            return (
              <Link
                className="history-item card"
                key={a.id}
                to={`/practice/${a.lessonId}/result?attempt=${a.id}`}
              >
                <span className="stat-icon">
                  <Headphones size={20} />
                </span>
                <div>
                  <strong>{lesson?.title || a.lessonId}</strong>
                  <small>
                    {new Date(a.completedAt).toLocaleString("vi-VN")}
                  </small>
                </div>
                <span className="badge level-A1">
                  {a.score}/{a.total} đúng
                </span>
                <ArrowRight size={17} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-history card">
          <Headphones size={30} />
          <h3>Hành trình của bạn bắt đầu từ đây</h3>
          <p>
            Chưa có bài đã hoàn thành. Chọn một bài nghe để tạo dấu mốc đầu
            tiên.
          </p>
          <Link className="text-link" to="/lessons">
            Khám phá bài học <ArrowRight size={16} />
          </Link>
        </div>
      )}
      {!isProgress && (
        <>
          <div className="section-heading">
            <h2>Thử một chủ đề mới</h2>
          </div>
          <div className="lesson-grid dashboard-lessons">
            {lessons.slice(0, 2).map((l) => (
              <LessonCard lesson={l} key={l.id} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
