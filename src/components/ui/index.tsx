import {
  ArrowRight,
  BookOpen,
  Coffee,
  Plane,
  BriefcaseBusiness,
  Sun,
  Laptop,
  Bookmark,
  Headphones,
  SearchX,
  AlertCircle,
} from "lucide-react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { Link } from "react-router-dom";
import type { Lesson, Level } from "../../types";
import { useApp } from "../../app/providers/AppProvider";
import { allTopics, levelLabels } from "../../data/mock/lessons";
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input ${props.className || ""}`} />;
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card ${className}`}>{children}</div>;
}
export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`badge ${className}`}>{children}</span>;
}
export function LevelBadge({ level }: { level: Level }) {
  return (
    <Badge className={`level-${level}`}>
      {level} · {levelLabels[level]}
    </Badge>
  );
}
export function TopicIcon({
  name,
  size = 24,
}: {
  name: string;
  size?: number;
}) {
  const Icon =
    (
      {
        coffee: Coffee,
        plane: Plane,
        briefcase: BriefcaseBusiness,
        sun: Sun,
        book: BookOpen,
        laptop: Laptop,
      } as Record<string, typeof Coffee>
    )[name] || Headphones;
  return <Icon size={size} strokeWidth={1.7} />;
}
export function LessonArt({
  lesson,
  big = false,
}: {
  lesson: Lesson;
  big?: boolean;
}) {
  return (
    <div
      className={`lesson-art ${lesson.color} ${big ? "big" : ""}`}
      aria-hidden="true"
    >
      <span className="art-circle circle-one" />
      <span className="art-circle circle-two" />
      <div className="art-object">
        <TopicIcon name={lesson.icon} size={big ? 100 : 66} />
      </div>
      <span className="art-spark">✦</span>
      <div className="art-waves">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { bookmarks, toggleBookmark } = useApp();
  const saved = bookmarks.includes(lesson.id);
  return (
    <article className="lesson-card card">
      <Link
        to={`/lessons/${lesson.slug}`}
        aria-label={`Xem bài ${lesson.title}`}
      >
        <LessonArt lesson={lesson} />
      </Link>
      <div className="lesson-content">
        <div className="flex-between">
          <LevelBadge level={lesson.level} />
          <button
            className={`icon-btn bookmark ${saved ? "saved" : ""}`}
            onClick={() => toggleBookmark(lesson.id)}
            aria-pressed={saved}
            aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ${lesson.title}`}
          >
            <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <Link className="lesson-title" to={`/lessons/${lesson.slug}`}>
          {lesson.title}
        </Link>
        <p className="lesson-description">{lesson.description}</p>
        <div className="lesson-meta">
          <span>{allTopics.find((t) => t.slug === lesson.topic)?.name}</span>
          <span>·</span>
          <span>{Math.ceil(lesson.duration / 60)} phút</span>
        </div>
        <Link className="lesson-start" to={`/practice/${lesson.id}`}>
          Bắt đầu nghe <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
export function EmptyState({
  title = "Chưa có nội dung",
  description,
  action,
}: {
  title?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <SearchX size={38} />
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Loading() {
  return (
    <div className="empty-state" role="status">
      <div className="spinner" />
      Đang tải nội dung…
    </div>
  );
}
export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={20} />
      <span>{message}</span>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
export function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  note: string;
}) {
  return (
    <Card className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </Card>
  );
}
