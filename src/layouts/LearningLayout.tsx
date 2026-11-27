import { Link, Outlet } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { Brand } from "../components/layout/Navigation";
export default function LearningLayout() {
  return (
    <>
      <header className="learning-header container">
        <Brand />
        <span>
          <Compass size={16} /> Hành trình luyện nghe
        </span>
        <Link to="/lessons">
          <ArrowLeft size={17} /> Thư viện bài học
        </Link>
      </header>
      <main id="main" className="learning-main">
        <Outlet />
      </main>
    </>
  );
}
