import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, Save, Volume2 } from "lucide-react";
import { useApp } from "../app/providers/AppProvider";
import { Button, Input, Card } from "../components/ui";
export function AuthPage({ register = false }: { register?: boolean }) {
  const { profile, setProfile, notify } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: register ? name.trim() : email.split("@")[0],
      email,
    });
    notify("Đã mở trải nghiệm demo. Thông tin chỉ lưu trên trình duyệt này.");
    navigate("/dashboard");
  };
  return (
    <div className="auth-form">
      <Link className="back-link" to="/">
        <ArrowLeft size={16} /> Về trang chủ
      </Link>
      <span className="eyebrow">WELCOME TO LISTENUP</span>
      <h1>{register ? "Bắt đầu hành trình mới" : "Chào mừng bạn trở lại"}</h1>
      <p>
        {register
          ? "Mỗi ngày một bài nghe, mỗi ngày thêm tự tin."
          : "Một bài nghe thú vị đang chờ bạn."}
      </p>
      <div className="demo-notice">
        <Info size={19} />
        <span>
          Đây là giao diện demo. Chưa kết nối xác thực tài khoản; mật khẩu không
          được lưu hoặc gửi đi.
        </span>
      </div>
      <form onSubmit={submit}>
        {register && (
          <label>
            Họ và tên
            <Input
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Bạn tên là gì?"
              pattern=".*\S.*"
            />
          </label>
        )}
        <label>
          Email
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="ban@example.com"
          />
        </label>
        <label>
          Mật khẩu
          <Input
            required
            type="password"
            minLength={8}
            autoComplete={register ? "new-password" : "current-password"}
            placeholder="Ít nhất 8 ký tự"
          />
        </label>
        <Button type="submit">
          {register ? "Tạo hồ sơ demo" : "Vào trải nghiệm demo"}{" "}
          <ArrowRight size={17} />
        </Button>
      </form>
      <p className="auth-switch">
        {register ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
        <Link to={register ? "/login" : "/register"}>
          {register ? "Đăng nhập" : "Đăng ký"}
        </Link>
      </p>
      <p className="auth-footnote">
        Bạn cũng có thể <Link to="/lessons">luyện nghe ngay</Link> mà không cần
        điền biểu mẫu.
      </p>
    </div>
  );
}
export function ProfilePage() {
  const { profile, setProfile, notify } = useApp();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">GÓC NHỎ CỦA BẠN</span>
        <h1>Hồ sơ cá nhân</h1>
        <p>Lưu thông tin để cá nhân hóa trải nghiệm học tập.</p>
      </div>
      <Card className="form-card">
        <div className="profile-intro">
          <span className="avatar large">
            {profile.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h2>{profile.name}</h2>
            <span className="badge neutral">Hồ sơ cục bộ</span>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setProfile({ ...profile, name: name.trim(), email });
            notify("Đã lưu hồ sơ trên trình duyệt này.");
          }}
        >
          <label>
            Họ và tên
            <Input
              required
              value={name}
              maxLength={60}
              pattern=".*\S.*"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@example.com"
            />
          </label>
          <p className="muted">
            Hồ sơ chưa đồng bộ với tài khoản hoặc máy chủ.
          </p>
          <Button type="submit">
            <Save size={17} /> Lưu thay đổi
          </Button>
        </form>
      </Card>
    </>
  );
}
export function SettingsPage() {
  const { preferences, setPreferences, profile, setProfile, notify } = useApp();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">HỌC THEO CÁCH CỦA BẠN</span>
        <h1>Cài đặt</h1>
        <p>Điều chỉnh trải nghiệm cho những buổi nghe thoải mái hơn.</p>
      </div>
      <Card className="form-card">
        <h2>Trình phát & transcript</h2>
        <div className="setting-row">
          <label htmlFor="default-speed">
            <strong>Tốc độ phát</strong>
            <small>Tốc độ mặc định cho các bài nghe.</small>
          </label>
          <select
            id="default-speed"
            className="input"
            value={preferences.speed}
            onChange={(e) => {
              setPreferences({ ...preferences, speed: Number(e.target.value) });
              notify("Đã lưu tốc độ phát.");
            }}
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => (
              <option value={v} key={v}>
                {v}×
              </option>
            ))}
          </select>
        </div>
        <div className="setting-row">
          <label htmlFor="default-volume">
            <strong>Âm lượng</strong>
            <small>{Math.round(preferences.volume * 100)}%</small>
          </label>
          <div className="volume-setting">
            <Volume2 size={18} />
            <input
              id="default-volume"
              aria-label="Âm lượng mặc định"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={preferences.volume}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  volume: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="setting-row">
          <label htmlFor="large-transcript">
            <strong>Transcript chữ lớn</strong>
            <small>Dễ đọc hơn khi theo dõi hội thoại.</small>
          </label>
          <input
            id="large-transcript"
            type="checkbox"
            className="switch"
            checked={preferences.largeTranscript}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                largeTranscript: e.target.checked,
              })
            }
          />
        </div>
      </Card>
      <Card className="form-card">
        <h2>Mục tiêu mỗi ngày</h2>
        <div className="setting-row">
          <label htmlFor="daily-goal">
            <strong>Thời gian luyện tập</strong>
            <small>Mục tiêu cá nhân, chưa có thông báo nhắc học.</small>
          </label>
          <select
            id="daily-goal"
            className="input"
            value={profile.goal}
            onChange={(e) => {
              setProfile({ ...profile, goal: Number(e.target.value) });
              notify("Đã lưu mục tiêu học tập.");
            }}
          >
            {[5, 10, 15, 20, 30].map((n) => (
              <option key={n} value={n}>
                {n} phút
              </option>
            ))}
          </select>
        </div>
        <p className="muted">
          Các tùy chọn được lưu tự động trên trình duyệt này. Giao diện tối sẽ
          được bổ sung trong giai đoạn sau.
        </p>
      </Card>
    </>
  );
}
