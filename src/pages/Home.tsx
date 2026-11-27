import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Compass,
  Flag,
  Map,
  Store,
  Trophy,
} from "lucide-react";
import { useApp } from "../app/providers/AppProvider";
import { campaigns, dailyExpedition, runKey } from "../data/mock/expeditions";
import { topics } from "../data/mock/lessons";
import { TopicIcon } from "../components/ui";
import {
  AdventureHud,
  Landscape,
  Sprite,
  useAdventureClock,
} from "../features/adventure/AdventureVisuals";

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
        <Landscape />
        <div className="adventure-hero-copy">
          <h1>
            Hành trình <br />
            <em>qua từng ải.</em>
          </h1>
          <p>
            Nghe tiếng Anh, giải thử thách và mở rương cùng nhà thám hiểm của
            bạn.
          </p>
          <div className="adventure-actions">
            <a className="btn btn-adventure" href="#campaigns">
              <Map size={17} /> Xem bản đồ ải <ArrowDown size={16} />
            </a>
            <Link className="btn btn-adventure-outline" to="/shop">
              <Store size={17} /> Cửa hàng
            </Link>
          </div>
        </div>
        <div className="hero-party">
          <Sprite id="hero" />
          {pet && <Sprite id={pet} />}
        </div>
      </section>
      <section className="daily-banner card" aria-labelledby="daily-heading">
        <div className="daily-icon">
          <CalendarDays size={25} />
        </div>
        <div>
          <h2 id="daily-heading">Ải hằng ngày</h2>
          <p>
            {dailyRun?.finished
              ? "Bạn đã nhận thưởng hôm nay. Ải mới mở vào ngày mai."
              : dailyRun?.failed
                ? "Lượt trước thất bại. Bạn có thể thử lại hôm nay."
                : `${daily.stages.length} chặng luyện nghe · Rương giữa ải và cuối ải`}
          </p>
        </div>
        <Link className="btn btn-primary" to="/adventure/daily">
          {dailyRun?.finished
            ? "Xem kết quả"
            : dailyRun?.failed
              ? "Thử lại"
              : dailyRun
                ? "Tiếp tục"
                : "Vào ải"}{" "}
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
            <h2 id="campaign-heading">Bản đồ chiến dịch</h2>
            <p>
              Hoàn thành các ải trong một chủ đề để mở khóa vật phẩm và bạn đồng
              hành.
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
                          <strong>{campaign.stages[0].lesson.level}</strong>
                          <small>
                            {done
                              ? "Đã hoàn thành"
                              : run?.failed
                                ? "Lượt trước thất bại"
                                : run
                                  ? `Chặng ${run.index + 1}/${campaign.stages.length}`
                                  : `${campaign.stages.length} chặng`}
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
