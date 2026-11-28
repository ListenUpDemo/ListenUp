import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { topics, lessons } from "../data/mock/lessons";
import { TopicIcon } from "../components/ui";
export default function Topics() {
  return (
    <div className="container page-content">
      <div className="page-heading">
        <span className="eyebrow">HỌC TỪ NHỮNG ĐIỀU GẦN GŨI</span>
        <h1>
          Chủ đề đời thường<span className="heading-dot">.</span>
        </h1>
        <p>Tìm hiểu văn hóa và luyện phát âm qua các tình huống đời thường.</p>
      </div>
      <div className="topics-large-grid">
        {topics.map((t) => (
          <Link
            className="topic-large card"
            key={t.slug}
            to={`/topics/${t.slug}`}
          >
            <div className={`topic-large-art ${t.color}`}>
              <TopicIcon name={t.icon} size={72} />
              <span>✦</span>
            </div>
            <div>
              <h2>{t.name}</h2>
              <p>{t.description}</p>
              <span className="text-link">
                {lessons.filter((l) => l.topic === t.slug).length} bài học{" "}
                <ArrowRight size={17} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
