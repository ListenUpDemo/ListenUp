import { useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Send, RotateCcw } from "lucide-react";
import { lessons } from "../data/mock/lessons";
import { LevelBadge, Button, EmptyState } from "../components/ui";
import Modal from "../components/ui/Modal";
import AudioPlayer from "../components/audio/AudioPlayer";
import QuestionCard from "../components/exercises/QuestionCard";
import TranscriptPanel from "../features/listening/TranscriptPanel";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useApp } from "../app/providers/AppProvider";
import { gradeAnswers } from "../utils/scoring.mjs";
export default function Practice() {
  const { lessonId } = useParams();
  const lesson = lessons.find((l) => l.id === lessonId);
  return lesson ? (
    <PracticeSession key={lesson.id} lesson={lesson} />
  ) : (
    <EmptyState
      title="Không tìm thấy bài luyện nghe"
      description="Hãy chọn một bài trong thư viện."
      action={
        <Link className="btn btn-primary" to="/lessons">
          Xem bài học
        </Link>
      }
    />
  );
}
function PracticeSession({ lesson }: { lesson: (typeof lessons)[number] }) {
  const [draft, setDraft] = useLocalStorage<{
    answers: Record<string, number>;
    checked: string[];
    index: number;
  }>(`listenup.draft.${lesson.id}`, { answers: {}, checked: [], index: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [restart, setRestart] = useState(false);
  const [started] = useState(Date.now());
  const audioRef = useRef<HTMLAudioElement>(null);
  const { addAttempt } = useApp();
  const navigate = useNavigate();
  const index = Math.min(draft.index, lesson.questions.length - 1);
  const question = lesson.questions[index];
  const answered = lesson.questions.filter(
    (q) => draft.answers[q.id] !== undefined,
  ).length;
  const submit = () => {
    const id = crypto.randomUUID();
    addAttempt({
      id,
      lessonId: lesson.id,
      answers: draft.answers,
      score: gradeAnswers(lesson.questions, draft.answers),
      total: lesson.questions.length,
      completedAt: new Date().toISOString(),
      seconds: Math.max(1, Math.round((Date.now() - started) / 1000)),
    });
    setDraft({ answers: {}, checked: [], index: 0 });
    audioRef.current?.pause();
    navigate(`/practice/${lesson.id}/result?attempt=${id}`);
  };
  return (
    <>
      <div className="practice-topline">
        <Link className="back-link" to={`/lessons/${lesson.slug}`}>
          <ArrowLeft size={16} /> Về bài học
        </Link>
        <Button
          variant="ghost"
          className="btn-small"
          onClick={() => setRestart(true)}
        >
          <RotateCcw size={15} /> Làm lại
        </Button>
      </div>
      <div className="practice-heading">
        <LevelBadge level={lesson.level} />
        <h1>{lesson.title}</h1>
        <p>Nghe thật thoải mái. Bạn có thể nghe lại bao nhiêu lần tùy thích.</p>
      </div>
      <div className="exercise-progress">
        <span>Tiến độ bài tập</span>
        <strong>
          {answered}/{lesson.questions.length} câu
        </strong>
        <progress
          value={answered}
          max={lesson.questions.length}
          aria-label="Số câu đã trả lời"
        />
      </div>
      <AudioPlayer
        src={lesson.audioUrl}
        audioRef={audioRef}
        onTimeChange={setCurrentTime}
      />
      <div className="question-navigation">
        <span>
          Câu hỏi <strong>{index + 1}</strong> / {lesson.questions.length}
        </span>
        <div>
          {lesson.questions.map((q, i) => (
            <button
              key={q.id}
              className={`question-dot ${index === i ? "active" : ""} ${draft.answers[q.id] !== undefined ? "answered" : ""}`}
              aria-label={`Câu hỏi ${i + 1}${draft.answers[q.id] !== undefined ? ", đã trả lời" : ""}`}
              aria-current={index === i ? "step" : undefined}
              onClick={() => setDraft({ ...draft, index: i })}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <QuestionCard
        question={question}
        index={index}
        value={draft.answers[question.id]}
        checked={draft.checked.includes(question.id)}
        onChange={(value) =>
          setDraft({
            ...draft,
            answers: { ...draft.answers, [question.id]: value },
          })
        }
      />
      <div className="question-actions">
        <Button
          variant="secondary"
          disabled={index === 0}
          onClick={() => setDraft({ ...draft, index: index - 1 })}
        >
          <ArrowLeft size={17} /> Câu trước
        </Button>
        <div>
          {!draft.checked.includes(question.id) && (
            <Button
              variant="secondary"
              disabled={draft.answers[question.id] === undefined}
              onClick={() =>
                setDraft({ ...draft, checked: [...draft.checked, question.id] })
              }
            >
              <Check size={17} /> Kiểm tra đáp án
            </Button>
          )}
          {index < lesson.questions.length - 1 ? (
            <Button onClick={() => setDraft({ ...draft, index: index + 1 })}>
              Câu tiếp theo <ArrowRight size={17} />
            </Button>
          ) : (
            <Button
              disabled={answered !== lesson.questions.length}
              onClick={() => setConfirm(true)}
            >
              Nộp bài <Send size={16} />
            </Button>
          )}
        </div>
      </div>
      {index === lesson.questions.length - 1 &&
        answered !== lesson.questions.length && (
          <p className="muted text-right" role="status">
            Trả lời đủ {lesson.questions.length} câu để nộp bài.
          </p>
        )}
      <TranscriptPanel
        url={lesson.transcriptUrl}
        currentTime={currentTime}
        onSeek={(time) => {
          if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
          }
        }}
      />
      <p className="practice-note">
        Tiến độ làm bài được lưu tự động trên trình duyệt này.
      </p>
      <Modal
        open={confirm}
        title="Sẵn sàng xem kết quả?"
        onClose={() => setConfirm(false)}
      >
        <p>
          Bạn đã trả lời {answered}/{lesson.questions.length} câu. Nộp bài để
          xem điểm và giải thích chi tiết.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setConfirm(false)}>
            Nghe thêm một chút
          </Button>
          <Button onClick={submit}>Nộp bài & xem kết quả</Button>
        </div>
      </Modal>
      <Modal
        open={restart}
        title="Làm lại bài nghe?"
        onClose={() => setRestart(false)}
      >
        <p>
          Các câu trả lời hiện tại sẽ được xóa. Kết quả đã nộp vẫn được giữ lại.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setRestart(false)}>
            Tiếp tục làm bài
          </Button>
          <Button
            onClick={() => {
              setDraft({ answers: {}, checked: [], index: 0 });
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              setCurrentTime(0);
              setRestart(false);
            }}
          >
            Bắt đầu lại
          </Button>
        </div>
      </Modal>
    </>
  );
}
