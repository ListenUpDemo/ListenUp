import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Trophy,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useApp } from "../app/providers/AppProvider";
import { lessons } from "../data/mock/lessons";
import { EmptyState } from "../components/ui";
export default function Result() {
  const { lessonId } = useParams();
  const [params] = useSearchParams();
  const { attempts } = useApp();
  const lesson = lessons.find((l) => l.id === lessonId);
  const attemptId = params.get("attempt");
  const attempt = [...attempts]
    .reverse()
    .find((a) => a.lessonId === lessonId && (!attemptId || a.id === attemptId));
  if (!lesson || !attempt)
    return (
      <EmptyState
        title="Chưa có kết quả bài này"
        description="Hoàn thành bài luyện nghe để xem điểm và giải thích."
        action={
          <Link
            className="btn btn-primary"
            to={lesson ? `/practice/${lesson.id}` : "/lessons"}
          >
            Bắt đầu luyện nghe
          </Link>
        }
      />
    );
  const percent = Math.round((attempt.score / attempt.total) * 100);
  return (
    <>
      <div className="result-hero card">
        <div className="trophy-icon">
          <Trophy size={43} />
        </div>
        <span className="eyebrow">THÊM MỘT BƯỚC TIẾN MỚI</span>
        <h1>
          {percent >= 80
            ? "Bạn đã làm rất tốt!"
            : "Mỗi lần nghe, một lần tiến bộ!"}
        </h1>
        <p>
          Bạn đã hoàn thành bài <strong>{lesson.title}</strong>.
        </p>
        <div
          className="score-ring"
          style={{
            background: `conic-gradient(var(--primary) ${percent}%, #e9eff8 0)`,
          }}
        >
          <div>
            <strong>{percent}%</strong>
            <span>
              {attempt.score}/{attempt.total} câu đúng
            </span>
          </div>
        </div>
        <div className="result-actions">
          <Link className="btn btn-secondary" to={`/practice/${lesson.id}`}>
            <RotateCcw size={17} /> Luyện lại bài này
          </Link>
          <Link className="btn btn-primary" to="/lessons">
            Khám phá bài tiếp theo <ArrowRight size={17} />
          </Link>
        </div>
      </div>
      <div className="section-heading">
        <h2>Cùng xem lại đáp án</h2>
        <span className="muted">
          {new Date(attempt.completedAt).toLocaleString("vi-VN")}
        </span>
      </div>
      <div className="result-review">
        {lesson.questions.map((q, i) => {
          const correct = attempt.answers[q.id] === q.answer;
          return (
            <article className="card review-card" key={q.id}>
              <h3>
                {correct ? (
                  <CheckCircle2 className="text-green" size={21} />
                ) : (
                  <XCircle className="text-red" size={21} />
                )}{" "}
                {i + 1}. {q.prompt}
              </h3>
              <p>
                Câu trả lời của bạn:{" "}
                <strong className={correct ? "text-green" : "text-red"}>
                  {q.options[attempt.answers[q.id]] || "Chưa trả lời"} ·{" "}
                  {correct ? "Đúng" : "Chưa đúng"}
                </strong>
              </p>
              {!correct && (
                <p>
                  Đáp án đúng: <strong>{q.options[q.answer]}</strong>
                </p>
              )}
              <p className="review-explanation">{q.explanation}</p>
            </article>
          );
        })}
      </div>
      <Link className="text-link result-dashboard" to="/dashboard">
        Xem tiến độ của bạn <ArrowRight size={17} />
      </Link>
    </>
  );
}
