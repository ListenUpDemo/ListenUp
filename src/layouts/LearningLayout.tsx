import { Link, Outlet } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Brand } from "../components/layout/Navigation";
export default function LearningLayout() {
  return (
    <>
      <header className="learning-header container">
        <Brand />
        <span>
          <ShieldCheck size={16} /> Không gian tập trung
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
