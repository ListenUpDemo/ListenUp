import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { ArrowRight, Check, LockKeyhole, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../app/providers/AppProvider";
import { TopicIcon } from "../../components/ui";
import { journeyCampaigns, runKey } from "../../data/mock/expeditions";
import { topics } from "../../data/mock/lessons";
import { Sprite } from "./AdventureVisuals";
import { CharacterPortrait } from "./Character";

const railWidth = 108;
const travelTime = 650;

export default function TopicJourney({
  unlock,
}: {
  unlock?: { from: string; to: string };
} = {}) {
  const { adventure, journey } = useApp();
  const navigate = useNavigate();
  const campaigns = unlock
    ? journeyCampaigns.filter(
        ({ id }) => id === unlock.from || id === unlock.to,
      )
    : journeyCampaigns;
  const stops = campaigns.map((campaign, index) => ({
    campaign,
    x: index % 2 === 0 ? 30 : 66,
    y: (index + 0.5) / campaigns.length,
  }));
  const [selected, setSelected] = useState(
    unlock?.from ?? journey.next?.id ?? campaigns.at(-1)?.id,
  );
  const [walking, setWalking] = useState(false);
  const [pending, setPending] = useState<string>();
  const [railHeight, setRailHeight] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const choseCard = useRef(false);
  const index = Math.max(
    0,
    stops.findIndex(({ campaign }) => campaign.id === selected),
  );
  const destination = stops[index];
  const pet = adventure.loadout.pet;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const observer = new ResizeObserver(([entry]) =>
      setRailHeight(entry.contentRect.height),
    );
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  const unlockTarget = unlock?.to;
  const ready = railHeight > 0;
  useEffect(() => {
    if (!unlockTarget || !ready) return;
    const timeout = window.setTimeout(() => {
      if (choseCard.current) return;
      setWalking(true);
      setSelected(unlockTarget);
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [unlockTarget, ready]);

  useEffect(() => {
    if (!walking) return;
    const timeout = window.setTimeout(
      () => setWalking(false),
      travelTime + 100,
    );
    return () => window.clearTimeout(timeout);
  }, [selected, walking]);

  useEffect(() => {
    if (walking || !pending) return;
    setPending(undefined);
    navigate(pending);
  }, [navigate, pending, walking]);

  function openCard(
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
    url: string,
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    )
      return;
    choseCard.current = true;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (selected === id && !walking)
    )
      return;
    event.preventDefault();
    setPending(url);
    if (selected !== id) {
      setWalking(true);
      setSelected(id);
    }
  }

  if (!destination) return null;
  const firstIncomplete = stops.findIndex(
    ({ campaign }) => !journey.completed.has(campaign.id),
  );
  const completedSegments =
    firstIncomplete < 0 ? stops.length - 1 : firstIncomplete;
  const track = (height: number, segments = stops.length - 1) => {
    const start = stops[0];
    const curves = stops.slice(1, segments + 1).map((stop, i) => {
      const from = stops[i];
      const middle = ((from.y + stop.y) / 2) * height;
      return `C ${from.x} ${middle}, ${stop.x} ${middle}, ${stop.x} ${stop.y * height}`;
    });
    return [`M ${start.x} ${start.y * height}`, ...curves].join(" ");
  };

  return (
    <>
      {!unlock && (
        <p className="topic-journey-summary">
          <Trophy size={17} aria-hidden="true" />
          {journey.completed.size}/{journeyCampaigns.length} bài hoàn thành
        </p>
      )}
      <div
        className={`topic-journey${unlock ? " topic-journey-unlock" : ""}`}
        style={
          {
            "--journey-rail-width": `${railWidth}px`,
            "--journey-travel-time": `${travelTime}ms`,
          } as CSSProperties
        }
      >
        <div className="topic-journey-rail" ref={railRef} aria-hidden="true">
          <svg viewBox={`0 0 ${railWidth} 100`} preserveAspectRatio="none">
            <path d={track(100)} />
            {completedSegments > 0 && (
              <path
                className="topic-journey-completed-path"
                d={track(100, completedSegments)}
              />
            )}
          </svg>
          <div
            className={
              ready
                ? "topic-journey-position follows-curve"
                : "topic-journey-position"
            }
            style={
              {
                "--journey-x": `${destination.x}px`,
                "--journey-y": `${destination.y * 100}%`,
                "--journey-route": `path("${track(railHeight)}")`,
                "--journey-distance": `${(index / Math.max(1, stops.length - 1)) * 100}%`,
              } as CSSProperties
            }
            onTransitionEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                ["offset-distance", "top", "left"].includes(event.propertyName)
              ) {
                setWalking(false);
              }
            }}
          >
            <div className="topic-journey-party">
              <CharacterPortrait />
              {pet && <Sprite id={pet} walking={walking} />}
            </div>
          </div>
        </div>
        <ol className="topic-journey-stops" aria-label="Lộ trình bài luyện">
          {stops.map(({ campaign, x }, stopIndex) => {
            const { lesson } = campaign.stages[0];
            const topic = topics.find(({ slug }) => slug === campaign.topic);
            const active = selected === campaign.id;
            const completed = journey.completed.has(campaign.id);
            const locked = journey.lockedCampaigns.has(campaign.id);
            const run = adventure.runs[runKey(campaign)];
            const url = `/adventure/campaign/${campaign.id}`;
            const startsTopic =
              stops[stopIndex - 1]?.campaign.topic !== campaign.topic;
            const cardContent = (
              <>
                {!unlock && (
                  <p className="topic-stop-meta">
                    {topic?.name}{" "}
                    <span className="badge neutral">{lesson.level}</span>
                  </p>
                )}
                <h3>
                  <span className="topic-stop-node" aria-hidden="true">
                    {locked ? (
                      <LockKeyhole size={18} />
                    ) : completed ? (
                      <Check size={20} />
                    ) : (
                      <TopicIcon name={topic?.icon ?? "book"} size={19} />
                    )}
                  </span>
                  <span lang="en-US">{lesson.title}</span>
                </h3>
                {!unlock && <p>{lesson.description}</p>}
                <div className="topic-stop-actions">
                  {locked ? (
                    <span className="topic-stop-status">
                      <LockKeyhole size={15} aria-hidden="true" /> Chưa mở khóa
                    </span>
                  ) : (
                    <span className="text-link">
                      {pending === url
                        ? "Đang tới bài…"
                        : completed
                          ? "Luyện lại"
                          : run?.failed
                            ? "Thử lại"
                            : run
                              ? "Tiếp tục"
                              : "Bắt đầu luyện"}
                      <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  )}
                  {completed && (
                    <span className="topic-stop-status">
                      <Check size={15} aria-hidden="true" /> Đã hoàn thành
                    </span>
                  )}
                </div>
              </>
            );
            return (
              <li
                key={campaign.id}
                className="topic-journey-stop"
                data-campaign={campaign.id}
                style={{ "--journey-x": `${x}px` } as CSSProperties}
              >
                <div className="topic-stop-content">
                  {locked ? (
                    <article
                      className="card topic-stop-card"
                      data-locked="true"
                    >
                      {cardContent}
                    </article>
                  ) : (
                    <Link
                      className="card topic-stop-card"
                      data-selected={active}
                      aria-current={active ? "step" : undefined}
                      aria-busy={pending === url || undefined}
                      to={url}
                      onClick={(event) => openCard(event, campaign.id, url)}
                    >
                      {cardContent}
                    </Link>
                  )}
                  {!unlock && startsTopic && topic && (
                    <Link
                      className="text-link topic-stop-library"
                      to={`/topics/${topic.slug}`}
                    >
                      Bài nghe theo chủ đề
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
