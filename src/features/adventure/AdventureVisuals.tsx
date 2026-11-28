import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  Check,
  Coins,
  Sandwich,
  BookOpen,
  NotebookPen,
  Zap,
  Flag,
  PawPrint,
  Gift,
} from "lucide-react";
import type { Slot } from "../../data/mock/adventureItems";
import type { ExpeditionRun } from "../../types/adventure";
import { useApp } from "../../app/providers/AppProvider";
import { HEART_INTERVAL, MAX_HEALTH, settleHealth } from "./engine";

export const slotIcons = {
  potion: Sandwich,
  shield: BookOpen,
  sword: NotebookPen,
  pet: PawPrint,
} satisfies Record<Slot, typeof Zap>;
const assetBase = `${import.meta.env.BASE_URL}assets/adventure/`;

export function useAdventureClock() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const interval = window.setInterval(refresh, 1_000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return now;
}

export function AdventureHud() {
  const { adventure } = useApp();
  const now = useAdventureClock();
  const { health, nextHeartAt, coins } = settleHealth(adventure, now);
  const remaining = Math.min(
    HEART_INTERVAL / 1_000,
    Math.max(0, Math.ceil(((nextHeartAt ?? now) - now) / 1_000)),
  );
  const countdown = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
  return (
    <div className="adventure-hud">
      <span className="health-display">
        <Zap size={17} fill="currentColor" aria-hidden="true" />
        Năng lượng {health}/{MAX_HEALTH}
      </span>
      {nextHeartAt !== null && (
        <span
          className="heart-timer"
          title="Thời gian đến lần hồi năng lượng tiếp theo"
        >
          +1 sau {countdown}
        </span>
      )}
      <span className="coin-display">
        <Coins size={17} aria-hidden="true" /> {coins} vàng
      </span>
    </div>
  );
}

export function Sprite({
  id,
  walking = false,
}: {
  id: string;
  walking?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`rpg-sprite rpg-sprite-cat${walking ? " rpg-sprite-walk" : ""}`}
      style={
        {
          "--sprite-frames": walking ? 8 : 10,
          backgroundImage: `url("${assetBase}${id}-${walking ? "walk" : "idle"}.png")`,
        } as CSSProperties
      }
    />
  );
}

export function StageMap({
  run,
  count,
}: {
  run?: ExpeditionRun;
  count: number;
}) {
  const index = run?.index ?? 0;

  return (
    <div className="stage-map">
      <div
        className="stage-track"
        style={{ "--stage-count": count } as CSSProperties}
      >
        <div className="stage-path" />
        <ol aria-label="Tiến độ câu hỏi">
          {Array.from({ length: count }, (_, i) => {
            const chest = i === count - 1 || i === Math.ceil(count / 2) - 1;
            const visited = run?.outcomes[i];
            const Icon = visited?.skipped
              ? BookOpen
              : visited?.correct
                ? Check
                : visited
                  ? Flag
                  : chest
                    ? Gift
                    : null;
            const label = visited
              ? visited.skipped
                ? "Đã xem đáp án bằng từ điển"
                : visited.correct
                  ? "Đã trả lời đúng"
                  : "Chưa đúng"
              : chest
                ? "Có quà"
                : "";
            return (
              <li
                key={i}
                aria-current={
                  !run?.finished && index === i ? "step" : undefined
                }
                className={visited ? "visited" : undefined}
              >
                <span title={`Câu ${i + 1}${label ? ` · ${label}` : ""}`}>
                  <span className="sr-only">
                    Câu {i + 1} {label}
                  </span>
                  {Icon ? (
                    <Icon size={15} aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{i + 1}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
