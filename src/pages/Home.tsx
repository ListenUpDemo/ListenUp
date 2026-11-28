import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Compass,
  Store,
} from "lucide-react";
import { useApp } from "../app/providers/AppProvider";
import { dailyExpedition, runKey } from "../data/mock/expeditions";
import {
  AdventureHud,
  Sprite,
  useAdventureClock,
} from "../features/adventure/AdventureVisuals";
import { CharacterPortrait } from "../features/adventure/Character";
import TopicJourney from "../features/adventure/TopicJourney";

export default function Home() {
  const { adventure, journey } = useApp();
  const daily = dailyExpedition(
    useAdventureClock(),
    journey.lockedLessons,
    adventure.runs,
  );
  const dailyRun = adventure.runs[runKey(daily)];
  const pet = adventure.loadout.pet;

  return (
    <div className="container adventure-home">
      <div className="adventure-bar">
        <span>
          <Compass size={18} /> Hành trình luyện nghe
        </span>
        <AdventureHud />
      </div>
      <section className="adventure-hero">
        <div className="adventure-hero-copy">
          <p className="journey-kicker">Luyện nghe và phát âm</p>
          <h1>
            Tiếng Anh cho
            <br />
            <em>cuộc sống mới.</em>
          </h1>
          <p>
            Cùng một người vừa chuyển đến nơi mới nghe hội thoại, tìm hiểu thói
            quen địa phương và luyện nói theo mẫu.
          </p>
          <div className="adventure-actions">
            <a className="btn btn-adventure" href="#campaigns">
              Chọn chủ đề <ArrowDown size={16} />
            </a>
            <Link className="btn btn-adventure-outline" to="/shop">
              <Store size={17} /> Cửa hàng
            </Link>
          </div>
        </div>
        <div className="journey-portrait">
          <div className="city-skyline" aria-hidden="true" />
          <CharacterPortrait />
          <span className="journey-name">
            <strong>Bạn học</strong>
            <small>Vừa chuyển đến</small>
          </span>
          {pet && (
            <span className="journey-pet">
              <Sprite id={pet} />
            </span>
          )}
        </div>
      </section>
      <section className="daily-banner card" aria-labelledby="daily-heading">
        <div className="daily-icon">
          <CalendarDays size={25} />
        </div>
        <div>
          <h2 id="daily-heading">Luyện tập hằng ngày</h2>
          <p>
            {dailyRun?.finished
              ? "Bạn đã hoàn thành. Bài luyện mới mở vào ngày mai."
              : dailyRun?.failed
                ? "Lượt trước thất bại. Bạn có thể thử lại hôm nay."
                : `${daily.stages.length} câu ôn tập từ các bài đã mở`}
          </p>
        </div>
        <Link className="btn btn-primary" to="/adventure/daily">
          {dailyRun?.finished
            ? "Xem kết quả"
            : dailyRun?.failed
              ? "Thử lại"
              : dailyRun
                ? "Tiếp tục"
                : "Luyện ngay"}{" "}
          <ArrowRight size={17} />
        </Link>
      </section>
      <section
        id="campaigns"
        className="campaign-section"
        aria-labelledby="campaign-heading"
      >
        <div className="campaign-heading">
          <h2 id="campaign-heading">Lộ trình chủ đề</h2>
          <p>Hoàn thành bài đang mở để đi tiếp trên lộ trình.</p>
        </div>
        <TopicJourney />
      </section>
    </div>
  );
}
