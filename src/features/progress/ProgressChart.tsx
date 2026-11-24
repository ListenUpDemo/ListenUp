import type { Attempt } from "../../types";
export default function ProgressChart({ attempts }: { attempts: Attempt[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const count = attempts.filter(
      (a) => new Date(a.completedAt).toDateString() === date.toDateString(),
    ).length;
    return {
      label: date.toLocaleDateString("vi-VN", { weekday: "short" }),
      date: date.toLocaleDateString("vi-VN"),
      count,
    };
  });
  const max = Math.max(3, ...days.map((d) => d.count));
  return (
    <div className="card chart-card">
      <div className="flex-between">
        <h2>Nhịp học của bạn</h2>
        <span className="badge neutral">7 ngày gần nhất</span>
      </div>
      <p className="muted">Số lượt hoàn thành bài nghe mỗi ngày</p>
      <div
        className="chart"
        role="img"
        aria-label={days.map((d) => `${d.date}: ${d.count} lượt`).join("; ")}
      >
        {days.map((d, i) => (
          <div key={d.date} className="chart-column">
            <span>{d.count}</span>
            <div className="chart-track">
              <div
                className={i === 6 ? "today" : ""}
                style={{ height: `${(d.count / max) * 100}%` }}
              />
            </div>
            <small>{d.label}</small>
          </div>
        ))}
      </div>
      {!attempts.length && (
        <p className="chart-note">
          Hoàn thành bài nghe đầu tiên để bắt đầu biểu đồ của bạn.
        </p>
      )}
    </div>
  );
}
