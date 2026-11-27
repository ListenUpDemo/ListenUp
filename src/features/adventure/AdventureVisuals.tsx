import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Check,
  Coins,
  FlaskConical,
  Flag,
  Heart,
  PawPrint,
  Shield,
  Swords,
  Trees,
  Mountain,
  Tent,
  Gift,
} from "lucide-react";
import type { Slot } from "../../data/mock/adventureItems";
import type { ExpeditionRun } from "../../types/adventure";
import { useApp } from "../../app/providers/AppProvider";
import { HEART_INTERVAL, MAX_HEALTH, settleHealth } from "./engine";

export const slotIcons = {
  potion: FlaskConical,
  shield: Shield,
  sword: Swords,
  pet: PawPrint,
} satisfies Record<Slot, typeof Heart>;
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
      <span
        className="health-display"
        role="img"
        aria-label={`Sinh mệnh ${health}/${MAX_HEALTH}`}
      >
        {Array.from({ length: MAX_HEALTH }, (_, index) => (
          <Heart
            key={index}
            size={17}
            fill={index < health ? "currentColor" : "none"}
            aria-hidden="true"
          />
        ))}
      </span>
      {nextHeartAt !== null && (
        <span
          className="heart-timer"
          title="Thời gian đến lần hồi sinh mệnh tiếp theo"
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
  const hero = id === "hero";
  return (
    <span
      aria-hidden="true"
      className={`rpg-sprite ${hero ? "rpg-sprite-hero" : "rpg-sprite-cat"} ${walking ? "rpg-sprite-walk" : ""}`}
      style={
        {
          "--sprite-frames": walking && !hero ? 8 : 10,
          backgroundImage: `url("${assetBase}${id}-${walking ? "walk" : "idle"}.png")`,
        } as CSSProperties
      }
    />
  );
}

export function Landscape() {
  return (
    <div className="rpg-landscape" aria-hidden="true">
      <i className="rpg-sun" />
      <i className="ridge ridge-far" />
      <i className="ridge ridge-near" />
      <i className="rpg-ground" />
      <Mountain className="rpg-mountain" strokeWidth={0.8} />
      <Trees className="rpg-trees trees-left" />
      <Trees className="rpg-trees trees-right" />
    </div>
  );
}

export function StageMap({
  run,
  count,
  pet,
}: {
  run?: ExpeditionRun;
  count: number;
  pet?: string;
}) {
  const index = run?.index ?? 0;
  const previousIndex = useRef(index);
  const [walking, setWalking] = useState(false);
  useEffect(() => {
    if (previousIndex.current === index) return;
    previousIndex.current = index;
    setWalking(true);
    const timer = window.setTimeout(() => setWalking(false), 720);
    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <div className="stage-map">
      <Landscape />
      <div
        className="stage-track"
        style={{ "--stage-count": count } as CSSProperties}
      >
        <div className="stage-path" />
        <div
          className={`stage-party ${index === 0 ? "stage-party-start" : ""}`}
          style={{ left: `${((index + 0.5) / count) * 100}%` }}
        >
          <Sprite id="hero" walking={walking} />
          {pet && <Sprite id={pet} walking={walking} />}
        </div>
        <ol aria-label="Các chặng của ải">
          {Array.from({ length: count }, (_, i) => {
            const chest = i === count - 1 || i === Math.ceil(count / 2) - 1;
            const visited = run?.outcomes[i];
            const Icon = visited?.correct
              ? Check
              : visited
                ? Flag
                : chest
                  ? Gift
                  : i === 0
                    ? Tent
                    : null;
            const label = visited
              ? visited.correct
                ? "Đã vượt qua"
                : "Chưa đúng"
              : chest
                ? "Có rương"
                : "";
            return (
              <li
                key={i}
                aria-current={index === i ? "step" : undefined}
                className={visited ? "visited" : undefined}
              >
                <span title={`Chặng ${i + 1}${label ? ` · ${label}` : ""}`}>
                  <span className="sr-only">
                    Chặng {i + 1} {label}
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
