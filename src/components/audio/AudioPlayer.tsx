import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Headphones,
} from "lucide-react";
import { useApp } from "../../app/providers/AppProvider";
import type { Lesson } from "../../types";
import { ErrorState } from "../ui";
export const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
export default function AudioPlayer({
  src,
  audioRef,
  onTimeChange,
  pronunciation,
}: {
  src: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  onTimeChange: (time: number) => void;
  pronunciation?: Lesson["pronunciation"];
}) {
  const { preferences, setPreferences } = useApp();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [waiting, setWaiting] = useState(false);
  const playRequest = useRef(0);
  const clip = useRef<{ start: number; end: number } | null>(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = preferences.speed;
      audioRef.current.volume = preferences.volume;
    }
  }, [preferences.speed, preferences.volume, audioRef]);
  useEffect(() => {
    clip.current = null;
    playRequest.current++;
    setCurrent(0);
    setDuration(0);
    setPlaying(false);
    setError("");
  }, [src]);
  const seek = (value: number) => {
    if (audioRef.current && duration) {
      clip.current = null;
      audioRef.current.currentTime = Math.max(0, Math.min(duration, value));
      setCurrent(audioRef.current.currentTime);
      onTimeChange(audioRef.current.currentTime);
    }
  };
  const play = async (audio: HTMLAudioElement) => {
    const request = ++playRequest.current;
    try {
      await audio.play();
    } catch (e) {
      if (
        request === playRequest.current &&
        (!(e instanceof DOMException) || e.name !== "AbortError")
      ) {
        clip.current = null;
        setError("Không thể phát audio. Hãy thử tải lại.");
      }
    }
  };
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    clip.current = null;
    if (audio.paused) void play(audio);
    else {
      playRequest.current++;
      audio.pause();
    }
  };
  const playSample = () => {
    const audio = audioRef.current;
    if (!audio || !pronunciation || !duration) return;
    clip.current = pronunciation;
    audio.currentTime = pronunciation.start;
    void play(audio);
  };
  return (
    <div className="audio-player card">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setError("");
        }}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          if (clip.current && audio.currentTime >= clip.current.end) {
            clip.current = null;
            audio.pause();
          }
          setCurrent(audio.currentTime);
          onTimeChange(audio.currentTime);
        }}
        onSeeking={(e) => {
          const time = e.currentTarget.currentTime;
          if (
            clip.current &&
            (time < clip.current.start - 0.01 || time > clip.current.end)
          )
            clip.current = null;
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setWaiting(false);
        }}
        onWaiting={() => setWaiting(true)}
        onCanPlay={() => setWaiting(false)}
        onPlaying={() => setWaiting(false)}
        onError={() =>
          setError("Không tải được audio. Kiểm tra kết nối và thử lại.")
        }
      />
      <div className="flex-between">
        <span className="audio-label">
          <Headphones size={18} /> LẮNG NGHE VÀ KHÁM PHÁ
        </span>
        <span className="badge neutral">
          {pronunciation
            ? "Tiếng Anh · Giọng tổng hợp"
            : "English · Demo audio"}
        </span>
      </div>
      <div className="audio-timeline">
        <span>{formatTime(current)}</span>
        <input
          type="range"
          aria-label="Vị trí phát audio"
          min="0"
          max={duration || 1}
          step="0.1"
          value={current}
          disabled={!duration || !!error}
          onChange={(e) => seek(Number(e.target.value))}
        />
        <span>{formatTime(duration)}</span>
      </div>
      <div className="audio-controls">
        <div className="speed-control">
          <label htmlFor="playback-speed">Tốc độ</label>
          <select
            id="playback-speed"
            value={preferences.speed}
            onChange={(e) =>
              setPreferences({ ...preferences, speed: Number(e.target.value) })
            }
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <option key={speed} value={speed}>
                {speed}×
              </option>
            ))}
          </select>
        </div>
        <div className="play-controls">
          <button
            className="icon-btn replay-button"
            aria-label="Tua lùi 10 giây"
            disabled={!duration || !!error}
            onClick={() => seek(current - 10)}
          >
            <RotateCcw size={23} />
            <small>10</small>
          </button>
          <button
            className="main-play"
            aria-label={playing ? "Tạm dừng" : "Phát audio"}
            onClick={toggle}
            disabled={!!error}
          >
            {playing ? (
              <Pause size={25} fill="currentColor" />
            ) : (
              <Play size={25} fill="currentColor" />
            )}
          </button>
          <button
            className="icon-btn replay-button"
            aria-label="Tua tiến 10 giây"
            disabled={!duration || !!error}
            onClick={() => seek(current + 10)}
          >
            <RotateCw size={23} />
            <small>10</small>
          </button>
        </div>
        <div className="volume-control">
          <Volume2 size={19} />
          <input
            aria-label="Âm lượng"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={preferences.volume}
            onChange={(e) =>
              setPreferences({ ...preferences, volume: Number(e.target.value) })
            }
          />
        </div>
      </div>
      {pronunciation && (
        <details className="pronunciation-panel">
          <summary>Luyện phát âm tiếng Anh</summary>
          <div>
            <p>
              <strong lang="en-US">{pronunciation.phrase}</strong>{" "}
              <span>{pronunciation.ipa}</span>
            </p>
            <p>{pronunciation.tip} Nghe mẫu rồi nhắc lại thành tiếng.</p>
            <button
              className="btn btn-secondary btn-small"
              onClick={playSample}
              disabled={!duration || !!error}
            >
              <Volume2 size={16} /> Nghe mẫu phát âm
            </button>
          </div>
        </details>
      )}
      {waiting && (
        <p role="status" className="muted">
          Đang tải audio…
        </p>
      )}
      {error && (
        <ErrorState
          message={error}
          retry={() => {
            setError("");
            audioRef.current?.load();
          }}
        />
      )}
    </div>
  );
}
