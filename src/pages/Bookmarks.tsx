import { Link } from "react-router-dom";
import { useApp } from "../app/providers/AppProvider";
import { allLessons } from "../data/mock/lessons";
import { EmptyState, LessonCard } from "../components/ui";
export default function Bookmarks() {
  const { bookmarks } = useApp();
  const saved = allLessons.filter((l) => bookmarks.includes(l.id));
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">DÀNH CHO LẦN NGHE TIẾP THEO</span>
        <h1>Bài học đã lưu</h1>
        <p>{saved.length} bài học trong bộ sưu tập của bạn.</p>
      </div>
      {saved.length ? (
        <div className="lesson-grid dashboard-lessons">
          {saved.map((l) => (
            <LessonCard lesson={l} key={l.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Giữ lại một bài nghe hay"
          description="Nhấn biểu tượng dấu trang trên bài học để lưu và nghe vào lúc bạn muốn."
          action={
            <Link className="btn btn-primary" to="/lessons">
              Khám phá bài học
            </Link>
          }
        />
      )}
    </>
  );
}
