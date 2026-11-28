import TopicJourney from "../features/adventure/TopicJourney";

export default function Topics() {
  return (
    <div className="container page-content topic-journey-page">
      <div className="page-heading">
        <h1>Lộ trình chủ đề</h1>
        <p>Hoàn thành bài đang mở để đi tiếp trên lộ trình.</p>
      </div>
      <TopicJourney />
    </div>
  );
}
