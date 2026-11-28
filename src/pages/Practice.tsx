import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Flag,
  Gift,
  BatteryMedium,
  BookOpen,
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
import { CharacterReaction } from "../features/adventure/Character";
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
      title="Không tìm thấy bài luyện"
      description="Hãy chọn một chủ đề hoặc một bài trong thư viện."
      action={
        <Link className="btn btn-primary" to="/">
          Về hành trình
        </Link>
      }
    />
  );
}

function Equipment({ loadout }: { loadout: Loadout }) {
  const { adventure } = useApp();
  return (
    <ul className="loadout-list" aria-label="Vật phẩm mang theo">
      {slots.map((slot) => {
        const Icon = slotIcons[slot];
        const item = findItem(loadout[slot]);
        const value = item ? (adventure.inventory[item.id] ?? 0) : 0;
        const stock = item?.durability
          ? ` · ${value}/${item.durability} lượt`
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
  const { adventure, act, masteredTopics } = useApp();
  const key = runKey(expedition);
  const run = adventure.runs[key];
  const finished = Boolean(run?.finished);
  const wasFinished = useRef(finished);
  const completionHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (finished && !wasFinished.current) completionHeading.current?.focus();
    wasFinished.current = finished;
  }, [finished]);
  const topicComplete =
    expedition.topic && masteredTopics.includes(expedition.topic);
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
        ? "Chủ đề đời thường"
        : "Luyện nghe và phát âm";

  return (
    <div className="expedition-page">
      <div className="expedition-topline">
        <Link className="back-link" to={back}>
          <ArrowLeft size={17} />{" "}
          {expedition.kind === "lesson" ? "Về bài học" : "Về chủ đề"}
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
        run={run}
        count={expedition.stages.length}
        pet={(run?.loadout ?? adventure.loadout).pet}
      />
      {!run ? (
        <section className="card expedition-panel">
          <h2>Chuẩn bị luyện tập</h2>
          <CharacterReaction>
            Cùng mình nghe hội thoại, nghe mẫu phát âm rồi nhắc lại thành tiếng.
          </CharacterReaction>
          <p>
            {expedition.stages.length} câu hỏi · {STAGE_COINS} vàng mỗi câu ·
            Quà giữa và cuối bài
          </p>
          <Equipment loadout={adventure.loadout} />
          {!canStart && (
            <p role="status">
              Bạn đã hết năng lượng. Hãy đợi hồi hoặc dùng đồ ăn ở cửa hàng.
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
            <XCircle size={25} /> Đã hết năng lượng
          </h2>
          <CharacterReaction mood="retry">
            Mình nghỉ một chút rồi quay lại luyện tiếp nhé.
          </CharacterReaction>
          <p>Hồi năng lượng để bắt đầu lượt mới.</p>
          <div className="adventure-actions">
            <Button disabled={!canStart} onClick={start}>
              Thử lại <ArrowRight size={17} />
            </Button>
            <Link className="btn btn-secondary" to="/shop">
              <Store size={17} /> Đến cửa hàng
            </Link>
          </div>
        </section>
      ) : run.finished ? (
        <section className="card expedition-panel">
          <h2 ref={completionHeading} tabIndex={-1}>
            <Trophy size={25} />{" "}
            {topicComplete ? "Chủ đề đã hoàn thành" : "Hoàn thành bài luyện"}
          </h2>
          <CharacterReaction mood="complete">
            {topicComplete
              ? "Mình đã luyện xong mọi bài trong chủ đề này. Cùng thử dùng những cụm vừa học nhé!"
              : "Mình luyện xong buổi này rồi! Cùng xem lại câu trả lời và nhắc lại mẫu phát âm nhé."}
          </CharacterReaction>
          <p>
            {run.outcomes.filter((stage) => stage.correct).length}/
            {run.outcomes.length} câu đúng ·{" "}
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
              Luyện lại
            </Button>
          )}
          {expedition.kind === "daily" && <p>Bài luyện mới mở vào ngày mai.</p>}
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
  const reactionRef = useRef<HTMLElement>(null);
  const chest = outcome?.chest;
  const loot = findItem(chest?.itemId);
  const selected = run.selected;
  const potion = findItem(run.loadout.potion);
  const feedback = run.feedback ?? (run.finalMisses ? "damage" : undefined);
  const previousReaction = useRef({ outcome, feedback });
  const runAction = {
    expedition,
    key: runKey(expedition),
    version: run.version,
    index: run.index,
  };

  useEffect(() => {
    if (run.index > 0) headingRef.current?.focus({ preventScroll: true });
  }, [run.index]);
  useEffect(() => {
    const previous = previousReaction.current;
    if (
      (outcome && !previous.outcome) ||
      (feedback && feedback !== previous.feedback)
    ) {
      reactionRef.current?.focus();
    }
    previousReaction.current = { outcome, feedback };
  }, [outcome, feedback]);

  return (
    <>
      <details className="card equipped-panel">
        <summary>Trang bị của lượt này</summary>
        <Equipment loadout={run.loadout} />
      </details>
      <div className="active-stage-heading">
        <div>
          <p>
            Câu {run.index + 1}/{expedition.stages.length}
            {finalStage && " · Câu cuối"}
          </p>
          <h2 ref={headingRef} tabIndex={-1}>
            <span lang="en-US">{lesson.title}</span>
          </h2>
        </div>
      </div>
      {lesson.culture && (
        <details className="card culture-note">
          <summary>Ghi chú văn hóa</summary>
          <p>{lesson.culture}</p>
        </details>
      )}
      <AudioPlayer
        src={lesson.audioUrl}
        pronunciation={lesson.pronunciation}
        audioRef={audioRef}
        onTimeChange={(value) =>
          setPlayback({ lessonId: lesson.id, time: value })
        }
      />
      {health === 0 && !outcome && (
        <p className="stage-alert" role="status">
          <BatteryMedium size={18} />
          <span>
            Hết năng lượng. Đợi hồi hoặc{" "}
            <Link className="text-link" to="/shop">
              đến cửa hàng dùng đồ ăn
            </Link>
            .
          </span>
        </p>
      )}
      {run.usedPotion && potion && (
        <p className="stage-alert" role="status">
          <BatteryMedium size={18} /> Đã tự dùng {potion.name} khi năng lượng về
          0. Lượt luyện sẽ kết thúc nếu lại hết năng lượng.
        </p>
      )}
      {!outcome && (feedback || finalStage) && (
        <p className="stage-alert" role="status">
          {feedback === "shield" ? (
            <>
              <BookOpen size={18} /> Đã dùng một lượt từ điển để giữ năng lượng.
              Hãy thử lại câu cuối.
            </>
          ) : feedback === "damage" ? (
            <>
              <XCircle size={18} /> Chưa đúng. Bạn mất 1 năng lượng. Hãy chọn
              lại.
            </>
          ) : (
            <>
              <Flag size={18} /> Hãy trả lời đúng câu cuối để hoàn thành bài
              luyện.
            </>
          )}
        </p>
      )}
      <div className="stage-question-layout">
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
        <CharacterReaction
          reactionRef={reactionRef}
          mood={
            outcome?.correct
              ? "correct"
              : outcome?.skipped || feedback === "shield"
                ? "dictionary"
                : feedback
                  ? "retry"
                  : "ready"
          }
        >
          {outcome?.correct
            ? "Bạn nghe đúng rồi! Thử nhắc lại câu mẫu cùng mình nhé."
            : outcome?.skipped
              ? "Cùng xem đáp án rồi chuyển sang câu tiếp theo nhé."
              : feedback
                ? "Nghe thêm một lần và để ý âm hoặc cụm từ trong câu hỏi."
                : "Mình nghe đoạn hội thoại rồi chọn đáp án nhé."}
        </CharacterReaction>
        {outcome ? (
          <div className="card stage-reward">
            {finalStage && (
              <p role="status">
                <CheckCircle2 size={18} /> Đã trả lời đúng câu cuối.
              </p>
            )}
            <p>
              <Coins size={19} /> <strong>+{outcome.coins} vàng</strong>
              {outcome.bonus > 0 && <span>Gồm +{outcome.bonus} từ sổ tay</span>}
            </p>
            {!outcome.correct && !outcome.skipped && (
              <p>
                <BatteryMedium size={17} /> −1 năng lượng
              </p>
            )}
            {chest &&
              loot &&
              (chest.opened ? (
                <p role="status">
                  <CheckCircle2 size={18} /> {loot.name}{" "}
                  {loot.durability
                    ? "· Đã nạp đầy lượt dùng"
                    : "· Đã thêm vào túi"}
                </p>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => act({ ...runAction, type: "open" })}
                >
                  <Gift size={18} /> Mở quà{" "}
                  {chest.kind === "potion" ? "đồ ăn" : "dụng cụ"}
                </Button>
              ))}
            <Button
              disabled={Boolean(chest && !chest.opened)}
              onClick={() => act({ ...runAction, type: "advance" })}
            >
              {run.index + 1 === expedition.stages.length
                ? "Hoàn thành bài luyện"
                : "Câu tiếp theo"}{" "}
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
      </div>
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
