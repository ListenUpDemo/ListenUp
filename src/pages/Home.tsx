import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Compass,
  Flag,
  Store,
  Trophy,
} from "lucide-react";
import { useApp } from "../app/providers/AppProvider";
import { campaigns, dailyExpedition, runKey } from "../data/mock/expeditions";
import { topics } from "../data/mock/lessons";
import { TopicIcon } from "../components/ui";
import {
  AdventureHud,
  Sprite,
  useAdventureClock,
} from "../features/adventure/AdventureVisuals";
import { CharacterPortrait } from "../features/adventure/Character";

export default function Home() {
  const { adventure, masteredTopics } = useApp();
  const daily = dailyExpedition(useAdventureClock());
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
                : `${daily.stages.length} câu từ ba tình huống đời thường`}
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
          <div>
            <h2 id="campaign-heading">Chủ đề đời thường</h2>
            <p>
              Mỗi chủ đề kết hợp tình huống văn hóa, bài nghe và mẫu phát âm.
            </p>
          </div>
          <span>
            <Trophy size={18} /> {masteredTopics.length}/{topics.length} chủ đề
          </span>
        </div>
        <div className="campaign-grid">
          {topics.map((topic) => (
            <article
              className="campaign-card card"
              key={topic.slug}
              data-region={topic.slug}
            >
              <div className="campaign-region">
                <TopicIcon name={topic.icon} size={24} />
                <h3>{topic.name}</h3>
              </div>
              <p className="campaign-description">{topic.description}</p>
              <div className="campaign-links">
                {campaigns
                  .filter((campaign) => campaign.topic === topic.slug)
                  .map((campaign) => {
                    const done = adventure.clearedCampaigns.includes(
                      campaign.id,
                    );
                    const run = adventure.runs[runKey(campaign)];
                    return (
                      <Link
                        to={`/adventure/campaign/${campaign.id}`}
                        key={campaign.id}
                      >
                        <Flag size={17} />
                        <span>
                          <strong>
                            {campaign.stages[0].lesson.level} ·{" "}
                            <span lang="en-US">
                              {campaign.stages[0].lesson.title}
                            </span>
                          </strong>
                          <small>
                            {done
                              ? "Đã hoàn thành"
                              : run?.failed
                                ? "Lượt trước thất bại"
                                : run
                                  ? `Câu ${run.index + 1}/${campaign.stages.length}`
                                  : `${campaign.stages.length} câu hỏi`}
                          </small>
                        </span>
                        <ArrowRight size={16} />
                      </Link>
                    );
                  })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
