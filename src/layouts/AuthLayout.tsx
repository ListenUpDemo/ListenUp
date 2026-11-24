import { Outlet } from "react-router-dom";
import { Brand } from "../components/layout/Navigation";
import { Headphones, Sparkles } from "lucide-react";
export default function AuthLayout() {
  return (
    <main id="main" className="auth-shell">
      <div className="auth-story">
        <Brand />
        <div>
          <span className="eyebrow">
            <Sparkles size={16} /> MỘT THÓI QUEN NHỎ, MỘT THẾ GIỚI MỚI
          </span>
          <h1>
            Lắng nghe hôm nay.
            <br />
            Tự tin ngày mai.
          </h1>
          <p>Tiếng Anh gần gũi hơn qua từng cuộc hội thoại.</p>
          <Headphones size={140} strokeWidth={1} />
        </div>
        <span>Listen a little. Grow a lot.</span>
      </div>
      <div className="auth-form-wrap">
        <Outlet />
      </div>
    </main>
  );
}
