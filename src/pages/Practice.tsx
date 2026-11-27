import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Flag,
  Gift,
  Heart,
  Shield,
  Store,
  Trophy,
  XCircle,
} from "lucide-react";
import { useApp } from "../app/providers/AppProvider";
import AudioPlayer from "../components/audio/AudioPlayer";
import QuestionCard from "../components/exercises/QuestionCard";
import { Button, EmptyState } from "../components/ui";
import { findItem, slots, slotLabels } from "../data/mock/adventureItems";
import {
  campaigns,
  dailyExpedition,
  lessonExpeditions,
  runKey,
} from "../data/mock/expeditions";
import type { Expedition, ExpeditionRun, Loadout } from "../types/adventure";
import {
  AdventureHud,
  slotIcons,
  StageMap,
  useAdventureClock,
} from "../features/adventure/AdventureVisuals";
import {
  STAGE_COINS,
  resolvedStage,
  settleHealth,
} from "../features/adventure/engine";
import TranscriptPanel from "../features/listening/TranscriptPanel";

export default function Practice({
  kind = "lesson",
}: {
  kind?: Expedition["kind"];
}) {
  const { lessonId, campaignId } = useParams();
  const now = useAdventureClock();
  const expedition =
    kind === "daily"
      ? dailyExpedition(now)
      : kind === "campaign"
        ? campaigns.find(({ id }) => id === campaignId)
        : lessonExpeditions.find(({ id }) => id === lessonId);
  return expedition ? (
    <ExpeditionPage
      key={runKey(expedition)}
      expedition={expedition}
      now={now}
    />
  ) : (
    <EmptyState
      title="Không tìm thấy ải"
      description="Hãy chọn một ải trên bản đồ hoặc một bài trong thư viện."
      action={
        <Link className="btn btn-primary" to="/">
          Về bản đồ
        </Link>
      }
    />
  );
}

function Equipment({ loadout }: { loadout: Loadout }) {
  const { adventure } = useApp();
  return (
    <ul className="loadout-list" aria-label="Trang bị đi ải">
      {slots.map((slot) => {
        const Icon = slotIcons[slot];
        const item = findItem(loadout[slot]);
        const value = item ? (adventure.inventory[item.id] ?? 0) : 0;
        const stock = item?.durability
          ? ` · ${value}/${item.durability}`
          : item?.slot === "potion"
            ? ` ×${value}`
            : "";
        return (
          <li key={slot}>
            <Icon size={18} />
            <span>
              <small>{slotLabels[slot]}</small>
              <strong>{item ? item.name + stock : "Chưa trang bị"}</strong>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ExpeditionPage({
  expedition,
  now,
}: {
  expedition: Expedition;
  now: number;
}) {
  const { adventure, act } = useApp();
  const key = runKey(expedition);
  const run = adventure.runs[key];
  const { health } = settleHealth(adventure, now);
  const canStart = health > 0;
  const start = () =>
    act({ type: "start", key, expedition, version: crypto.randomUUID() });
  const back =
    expedition.kind === "lesson"
      ? `/lessons/${expedition.stages[0].lesson.slug}`
      : "/#campaigns";
  const label =
    expedition.kind === "daily"
      ? "Luyện tập hằng ngày"
      : expedition.kind === "campaign"
        ? "Ải chiến dịch"
        : "Ải luyện nghe";

  return (
    <div className="expedition-page">
      <div className="expedition-topline">
        <Link className="back-link" to={back}>
          <ArrowLeft size={17} />{" "}
          {expedition.kind === "lesson" ? "Về bài học" : "Về bản đồ ải"}
        </Link>
        <AdventureHud />
      </div>
      <header className="expedition-heading">
        <p>
          <Flag size={16} /> {label}
        </p>
        <h1>{expedition.title}</h1>
      </header>
      <StageMap
        key={run ? `map-${run.version}` : "map-preparation"}
        run={run}
        count={expedition.stages.length}
        pet={(run?.loadout ?? adventure.loadout).pet}
      />
      {!run ? (
        <section className="card expedition-panel">
          <h2>Chuẩn bị vào ải</h2>
          <p>
            {expedition.stages.length} chặng · {STAGE_COINS} vàng mỗi chặng ·
            Rương giữa ải và cuối ải
          </p>
          <Equipment loadout={adventure.loadout} />
          {!canStart && (
            <p role="status">
              Bạn đã hết sinh mệnh. Hãy đợi hồi hoặc dùng thuốc ở cửa hàng.
            </p>
          )}
          <div className="adventure-actions">
            <Button onClick={start} disabled={!canStart}>
              Bắt đầu hành trình <ArrowRight size={17} />
            </Button>
            <Link className="btn btn-secondary" to="/shop">
              <Store size={17} /> Cửa hàng & trang bị
            </Link>
          </div>
        </section>
      ) : run.failed ? (
        <section className="card expedition-panel">
          <h2>
            <XCircle size={25} /> Ải thất bại
          </h2>
          <p>Bạn đã hết sinh mệnh. Hồi sinh mệnh để bắt đầu lượt mới.</p>
          <div className="adventure-actions">
            <Button disabled={!canStart} onClick={start}>
              Thử lại ải <ArrowRight size={17} />
            </Button>
            <Link className="btn btn-secondary" to="/shop">
              <Store size={17} /> Đến cửa hàng
            </Link>
          </div>
        </section>
      ) : run.finished ? (
        <section className="card expedition-panel">
          <h2>
            <Trophy size={25} /> Hoàn thành ải
          </h2>
          <p>
            {run.outcomes.filter((stage) => stage.correct).length}/
            {run.outcomes.length} chặng đúng ·{" "}
            {run.outcomes.reduce((total, stage) => total + stage.coins, 0)} vàng
            đã nhận
          </p>
          <ul className="expedition-results">
            {run.attempts.map((attempt) => (
              <li key={attempt.id}>
                <Link
                  className="text-link"
                  to={`/practice/${attempt.lessonId}/result?attempt=${attempt.id}`}
                >
                  {
                    expedition.stages.find(
                      (stage) => stage.lesson.id === attempt.lessonId,
                    )?.lesson.title
                  }{" "}
                  · {attempt.score}/{attempt.total} đúng{" "}
                  <ArrowRight size={16} />
                </Link>
              </li>
            ))}
          </ul>
          {expedition.kind !== "daily" && (
            <Button disabled={!canStart} onClick={start}>
              Đi ải lần nữa
            </Button>
          )}
          {expedition.kind === "daily" && <p>Ải mới mở vào ngày mai.</p>}
        </section>
      ) : (
        <ExpeditionStage
          key={run.version}
          expedition={expedition}
          run={run}
          health={health}
        />
      )}
    </div>
  );
}

function ExpeditionStage({
  expedition,
  run,
  health,
}: {
  expedition: Expedition;
  run: ExpeditionRun;
  health: number;
}) {
  const { act, masteredTopics } = useApp();
  const [playback, setPlayback] = useState({ lessonId: "", time: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { lesson, question } = expedition.stages[run.index];
  const time = playback.lessonId === lesson.id ? playback.time : 0;
  const finalStage = run.index === expedition.stages.length - 1;
  const outcome = resolvedStage(expedition, run);
  const chest = outcome?.chest;
  const loot = findItem(chest?.itemId);
  const selected = run.selected;
  const potion = findItem(run.loadout.potion);
  const feedback = run.feedback ?? (run.finalMisses ? "damage" : undefined);
  const runAction = {
    expedition,
    key: runKey(expedition),
    version: run.version,
    index: run.index,
  };

  useEffect(() => {
    if (run.index > 0) headingRef.current?.focus({ preventScroll: true });
  }, [run.index]);

  return (
    <>
      <details className="card equipped-panel">
        <summary>Trang bị của lượt này</summary>
        <Equipment loadout={run.loadout} />
      </details>
      <div className="active-stage-heading">
        <div>
          <p>
            Chặng {run.index + 1}/{expedition.stages.length}
            {finalStage && " · Chặng cuối"}
          </p>
          <h2 ref={headingRef} tabIndex={-1}>
            {lesson.title}
          </h2>
        </div>
      </div>
      <AudioPlayer
        src={lesson.audioUrl}
        audioRef={audioRef}
        onTimeChange={(value) =>
          setPlayback({ lessonId: lesson.id, time: value })
        }
      />
      {health === 0 && !outcome && (
        <p className="stage-alert" role="status">
          <Heart size={18} />
          <span>
            Hết sinh mệnh. Đợi hồi hoặc{" "}
            <Link className="text-link" to="/shop">
              đến cửa hàng dùng thuốc
            </Link>
            .
          </span>
        </p>
      )}
      {run.usedPotion && potion && (
        <p className="stage-alert" role="status">
          <Heart size={18} /> Đã tự dùng {potion.name} khi sinh mệnh về 0. Hết
          sinh mệnh lần nữa sẽ thua ải.
        </p>
      )}
      {!outcome && (feedback || finalStage) && (
        <p className="stage-alert" role="status">
          {feedback === "shield" ? (
            <>
              <Shield size={18} /> Khiên đã đỡ đòn. Hãy chọn lại để vượt qua
              chặng cuối.
            </>
          ) : feedback === "damage" ? (
            <>
              <XCircle size={18} /> Chưa đúng. Bạn mất 1 sinh mệnh. Hãy chọn
              lại.
            </>
          ) : (
            <>
              <Flag size={18} /> Trả lời đúng để vượt qua chặng cuối.
            </>
          )}
        </p>
      )}
      {outcome?.skipped && (
        <p className="stage-alert" role="status">
          <Shield size={18} /> Khiên đã đỡ đòn và cho bạn bỏ qua chặng này.
        </p>
      )}
      <QuestionCard
        question={question}
        index={run.index}
        value={outcome?.answer ?? selected}
        checked={!finalStage && Boolean(outcome)}
        inactive={health === 0 || Boolean(outcome)}
        onChange={(value) =>
          act({ ...runAction, type: "select", answer: value })
        }
      />
      {outcome ? (
        <div className="card stage-reward">
          {finalStage && (
            <p role="status">
              <CheckCircle2 size={18} /> Đã vượt qua chặng cuối.
            </p>
          )}
          <p>
            <Coins size={19} /> <strong>+{outcome.coins} vàng</strong>
            {outcome.bonus > 0 && <span>Gồm +{outcome.bonus} từ kiếm</span>}
          </p>
          {!outcome.correct && !outcome.skipped && (
            <p>
              <Heart size={17} /> −1 sinh mệnh
            </p>
          )}
          {chest &&
            loot &&
            (chest.opened ? (
              <p role="status">
                <CheckCircle2 size={18} /> {loot.name}{" "}
                {loot.durability ? "· Độ bền tối đa" : "· Đã thêm vào túi"}
              </p>
            ) : (
              <Button
                variant="secondary"
                onClick={() => act({ ...runAction, type: "open" })}
              >
                <Gift size={18} /> Mở rương{" "}
                {chest.kind === "potion" ? "hồi phục" : "trang bị"}
              </Button>
            ))}
          <Button
            disabled={Boolean(chest && !chest.opened)}
            onClick={() => act({ ...runAction, type: "advance" })}
          >
            {run.index + 1 === expedition.stages.length
              ? "Hoàn thành ải"
              : "Sang chặng tiếp theo"}{" "}
            <ArrowRight size={17} />
          </Button>
        </div>
      ) : (
        <div className="stage-submit">
          <Button
            disabled={selected === undefined || health === 0}
            onClick={() =>
              act({
                ...runAction,
                type: "answer",
                unlocked: masteredTopics.length,
                random: Math.random(),
              })
            }
          >
            Kiểm tra đáp án <ArrowRight size={17} />
          </Button>
        </div>
      )}
      <TranscriptPanel
        url={lesson.transcriptUrl}
        currentTime={time}
        onSeek={(value) => {
          if (audioRef.current) {
            audioRef.current.currentTime = value;
            setPlayback({ lessonId: lesson.id, time: value });
          }
        }}
      />
    </>
  );
}
