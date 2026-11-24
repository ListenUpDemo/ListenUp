import { useState, useEffect } from "react";
import { FileText, ChevronDown, Type } from "lucide-react";
import { getTranscript } from "../../services/transcripts";
import type { TranscriptLine } from "../../types";
import { useApp } from "../../app/providers/AppProvider";
import { Loading, ErrorState } from "../../components/ui";
import { formatTime } from "../../components/audio/AudioPlayer";
export default function TranscriptPanel({
  url,
  currentTime,
  onSeek,
}: {
  url: string;
  currentTime: number;
  onSeek: (time: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const { preferences, setPreferences } = useApp();
  useEffect(() => {
    const controller = new AbortController();
    setLines([]);
    setError(false);
    getTranscript(url, controller.signal)
      .then(setLines)
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [url, retry]);
  return (
    <section className="transcript-panel card">
      <button
        className="transcript-toggle"
        aria-expanded={open}
        aria-controls="transcript-content"
        onClick={() => setOpen(!open)}
      >
        <span>
          <FileText size={19} />
          Transcript{" "}
          <small>
            {open ? "Nhấn vào một câu để nghe lại" : "Mở khi bạn cần hỗ trợ"}
          </small>
        </span>
        <ChevronDown size={19} className={open ? "rotate" : ""} />
      </button>
      {open && (
        <div id="transcript-content">
          <div className="transcript-tools">
            <span>Hội thoại tiếng Anh</span>
            <button
              className="btn btn-ghost btn-small"
              aria-pressed={preferences.largeTranscript}
              onClick={() =>
                setPreferences({
                  ...preferences,
                  largeTranscript: !preferences.largeTranscript,
                })
              }
            >
              <Type size={17} />{" "}
              {preferences.largeTranscript ? "Chữ tiêu chuẩn" : "Phóng to chữ"}
            </button>
          </div>
          {error ? (
            <ErrorState
              message="Không tải được transcript."
              retry={() => setRetry(retry + 1)}
            />
          ) : !lines.length ? (
            <Loading />
          ) : (
            <div
              className={`transcript-lines ${preferences.largeTranscript ? "large-text" : ""}`}
            >
              {lines.map((line, i) => (
                <button
                  key={i}
                  className={`transcript-line ${currentTime >= line.start && currentTime < line.end ? "current" : ""}`}
                  onClick={() => onSeek(line.start)}
                >
                  <span className="transcript-time">
                    {formatTime(line.start)}
                  </span>
                  <span>
                    <strong>{line.speaker}</strong>
                    <span>{line.text}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
