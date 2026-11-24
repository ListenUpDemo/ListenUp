import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Headphones,
  Check,
  AudioLines,
  Sparkles,
  MoveUpRight,
  BookOpen,
  BarChart3,
  CircleCheck,
  Star,
} from "lucide-react";
import { lessons, topics } from "../data/mock/lessons";
import { LessonCard, TopicIcon } from "../components/ui";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="pulse-dot" /> MỖI NGÀY MỘT CHÚT, TIẾN BỘ THẬT NHIỀU
          </span>
          <h1>
            Nghe tiếng Anh.
            <br />
            <span>Hiểu thế giới.</span>
          </h1>
          <p>
            Luyện nghe qua những câu chuyện đời thường.
            <br className="desktop-break" /> Học theo nhịp của bạn, tự tin hơn
            mỗi ngày.
          </p>
          <div className="hero-actions">
            <Link to="/lessons" className="btn btn-primary">
              Khám phá bài học <ArrowRight size={18} />
            </Link>
            <Link to="/practice/coffee-shop" className="demo-link">
              <span>
                <Play size={15} fill="currentColor" />
              </span>
              Thử một bài nghe
            </Link>
          </div>
          <div className="hero-checks">
            <span>
              <Check size={15} /> Miễn phí trải nghiệm
            </span>
            <span>
              <Check size={15} /> Học theo trình độ
            </span>
            <span>
              <Check size={15} /> Tiến bộ mỗi ngày
            </span>
          </div>
        </div>
        <div
          className="hero-visual"
          aria-label="Minh họa trải nghiệm luyện nghe ListenUp"
        >
          <div className="visual-grid" />
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="floating-note note-a">♪</div>
          <div className="floating-note note-b">✦</div>
          <div className="headphone-scene">
            <div className="headphone-disc" />
            <Headphones
              className="hero-headphones"
              size={210}
              strokeWidth={1.25}
            />
            <div className="sound-pill">
              <AudioLines size={18} /> Listen. Learn. Grow.
            </div>
          </div>
          <div className="floating-card daily-card">
            <span className="tiny-icon green">
              <CircleCheck size={22} />
            </span>
            <div>
              <strong>Mỗi ngày một bước tiến</strong>
              <small>Bạn đang làm rất tốt!</small>
            </div>
            <Sparkles size={18} className="text-green" />
          </div>
          <div className="floating-card player-preview">
            <span className="preview-play">
              <Play size={18} fill="currentColor" />
            </span>
            <div>
              <strong>At the Coffee Shop</strong>
              <div className="waveform" aria-hidden="true">
                {Array.from({ length: 26 }, (_, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${[9, 17, 25, 13, 31, 21, 12, 27, 18][i % 9]}px`,
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="preview-time">0:32</span>
          </div>
          <span className="visual-caption">
            A LITTLE LISTENING. A LOT OF POSSIBILITY.
          </span>
        </div>
      </section>
      <div className="benefit-strip">
        <div className="container">
          <span>
            <Headphones /> Hội thoại thực tế
          </span>
          <span>
            <BarChart3 /> Từ cơ bản đến nâng cao
          </span>
          <span>
            <BookOpen /> Transcript dễ theo dõi
          </span>
          <span>
            <CircleCheck /> Bài tập tương tác
          </span>
        </div>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">TÌM THẤY ĐIỀU BẠN THÍCH</span>
            <h2>Thế giới của bạn, bằng tiếng Anh</h2>
            <p>Bắt đầu từ những chủ đề gần gũi nhất với bạn.</p>
          </div>
          <Link className="text-link" to="/topics">
            Tất cả chủ đề <ArrowRight size={17} />
          </Link>
        </div>
        <div className="topic-grid">
          {topics.map((topic) => (
            <Link
              to={`/topics/${topic.slug}`}
              key={topic.slug}
              className="topic-tile"
            >
              <div className={`topic-icon ${topic.color}`}>
                <TopicIcon name={topic.icon} size={27} />
              </div>
              <div>
                <h3>{topic.name}</h3>
                <span>
                  {lessons.filter((l) => l.topic === topic.slug).length} bài học
                </span>
              </div>
              <MoveUpRight size={17} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section lesson-section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BẮT ĐẦU TỪ ĐÂY</span>
            <h2>
              Một bài nghe hay cho hôm nay<span className="heading-dot">.</span>
            </h2>
            <p>Những cuộc hội thoại ngắn. Những điều mới mẻ mỗi ngày.</p>
          </div>
          <Link className="text-link" to="/lessons">
            Xem tất cả bài học <ArrowRight size={17} />
          </Link>
        </div>
        <div className="lesson-grid">
          {lessons.slice(0, 3).map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>
      <section className="how-section container">
        <div className="how-intro">
          <span className="eyebrow">ĐƠN GIẢN ĐỂ BẮT ĐẦU</span>
          <h2>
            Một nhịp học nhỏ.
            <br />
            Một thay đổi lớn.
          </h2>
          <p>
            Không áp lực, không vội vàng.
            <br />
            Chỉ cần bạn và một chút thời gian mỗi ngày.
          </p>
          <Link className="text-link" to="/lessons">
            Bắt đầu hành trình <ArrowRight size={17} />
          </Link>
        </div>
        <div className="how-steps">
          {[
            {
              n: "01",
              icon: Headphones,
              title: "Chọn điều bạn muốn nghe",
              text: "Tìm bài học theo chủ đề và trình độ phù hợp.",
            },
            {
              n: "02",
              icon: Play,
              title: "Lắng nghe theo cách của bạn",
              text: "Tua lại, giảm tốc độ hoặc mở transcript khi cần.",
            },
            {
              n: "03",
              icon: Star,
              title: "Luyện tập và thấy mình tiến bộ",
              text: "Trả lời câu hỏi, xem giải thích và theo dõi kết quả.",
            },
          ].map(({ n, icon: Icon, title, text }) => (
            <div className="how-step" key={n}>
              <span className="step-number">{n}</span>
              <div>
                <h3>
                  <Icon size={18} />
                  {title}
                </h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container">
        <div className="bottom-cta">
          <div>
            <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>Hôm nay, bạn muốn nghe gì?</h2>
            <p>Một bài học nhỏ có thể mở ra một góc nhìn mới.</p>
          </div>
          <Link className="btn btn-primary" to="/lessons">
            Cùng bắt đầu nhé <ArrowRight size={18} />
          </Link>
          <Headphones className="cta-watermark" size={180} />
        </div>
      </section>
    </>
  );
}
