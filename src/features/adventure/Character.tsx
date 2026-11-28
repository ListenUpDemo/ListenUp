import { BookOpen, CheckCircle2, MessageCircle, Trophy } from "lucide-react";
import type { ReactNode, Ref } from "react";
import { preload } from "react-dom";

const assetBase = `${import.meta.env.BASE_URL}assets/character/`;
const portraits = {
  neutral: `${assetBase}reaction-neutral.png`,
  incorrect: `${assetBase}reaction-incorrect.png`,
  correct: `${assetBase}reaction-correct.png`,
  complete: `${assetBase}reaction-complete.png`,
};

export function CharacterPortrait() {
  return (
    <img
      src={`${assetBase}pose-standing.png`}
      alt=""
      aria-hidden="true"
      className="character-portrait"
      width={306}
      height={754}
    />
  );
}

const reactions = {
  ready: {
    icon: MessageCircle,
    title: "Cùng luyện nhé",
    image: portraits.neutral,
  },
  correct: {
    icon: CheckCircle2,
    title: "Chính xác!",
    image: portraits.correct,
  },
  dictionary: {
    icon: BookOpen,
    title: "Đã dùng một lượt từ điển",
    image: portraits.incorrect,
  },
  retry: {
    icon: MessageCircle,
    title: "Thử nghe lại nhé",
    image: portraits.incorrect,
  },
  complete: { icon: Trophy, title: "Hoàn thành!", image: portraits.complete },
};

export function CharacterReaction({
  mood = "ready",
  children,
  reactionRef,
}: {
  mood?: keyof typeof reactions;
  children: ReactNode;
  reactionRef?: Ref<HTMLElement>;
}) {
  const { icon: Icon, title, image } = reactions[mood];
  if (mood === "ready") {
    preload(portraits.incorrect, { as: "image" });
    preload(portraits.correct, { as: "image" });
    preload(portraits.complete, { as: "image" });
  }

  return (
    <aside
      className={`character-reaction character-${mood}`}
      aria-label="Phản hồi của bạn học"
      ref={reactionRef}
      tabIndex={reactionRef ? -1 : undefined}
    >
      <div className="character-art" aria-hidden="true">
        <img
          className="character-illustration"
          src={image}
          alt=""
          width={316}
          height={410}
        />
      </div>
      <div className="character-dialogue" role="status">
        <strong>
          <Icon size={20} aria-hidden="true" /> {title}
        </strong>
        <p>{children}</p>
      </div>
    </aside>
  );
}
