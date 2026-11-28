import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Headphones,
  ArrowUpRight,
  Menu,
  X,
  LayoutDashboard,
  TrendingUp,
  Bookmark,
  UserRound,
  Settings,
  House,
  BookOpen,
  Shapes,
  ChevronRight,
  Compass,
  Store,
} from "lucide-react";
import { useApp } from "../../app/providers/AppProvider";
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="ListenUp — Trang chủ">
      <span className="brand-icon">
        <Headphones size={24} />
      </span>
      Listen<span>Up</span>
      <span className="brand-dot">.</span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { profile } = useApp();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <NavLink to="/" end>
            Hành trình
          </NavLink>
          <NavLink to="/lessons">Bài học</NavLink>
          <NavLink to="/shop">Cửa hàng</NavLink>
          <NavLink to="/dashboard">Góc học tập</NavLink>
        </nav>
        <div className="header-actions">
          <Link className="login-link" to="/login">
            Đăng nhập
          </Link>
          <Link className="btn btn-primary btn-small" to="/adventure/daily">
            Luyện hằng ngày <ArrowUpRight size={16} />
          </Link>
          <Link className="avatar" to="/profile" aria-label="Hồ sơ cá nhân">
            {profile.name.charAt(0).toUpperCase()}
          </Link>
          <button
            className="icon-btn menu-toggle"
            aria-expanded={open}
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Menu di động">
          <NavLink to="/">Hành trình</NavLink>
          <NavLink to="/lessons">Bài học</NavLink>
          <NavLink to="/topics">Chủ đề</NavLink>
          <NavLink to="/shop">Cửa hàng</NavLink>
          <NavLink to="/adventure/daily">Luyện hằng ngày</NavLink>
          <NavLink to="/dashboard">Góc học tập</NavLink>
          <NavLink to="/bookmarks">Bài học đã lưu</NavLink>
          <NavLink to="/login">Đăng nhập</NavLink>
        </nav>
      )}
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer container">
      <div>
        <Brand />
        <p>Mỗi ngày nghe, mỗi ngày tiến bộ.</p>
        <p>
          Minh họa nhân vật từ gói Character poses with cool outfit. Sprite mèo
          của Ozzbit Games.
        </p>
      </div>
      <div className="footer-links">
        <Link to="/lessons">Khám phá bài học</Link>
        <Link to="/topics">Chủ đề</Link>
        <Link to="/settings">Cài đặt</Link>
        <span>© {new Date().getFullYear()} ListenUp</span>
      </div>
    </footer>
  );
}
const sidebarGroups = [
  {
    name: "KHÁM PHÁ",
    items: [
      { to: "/", label: "Hành trình", icon: House },
      { to: "/adventure/daily", label: "Luyện hằng ngày", icon: Compass },
      { to: "/shop", label: "Cửa hàng", icon: Store },
      { to: "/lessons", label: "Bài học", icon: BookOpen },
      { to: "/topics", label: "Chủ đề", icon: Shapes },
    ],
  },
  {
    name: "CÁ NHÂN",
    items: [
      { to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
      { to: "/progress", label: "Tiến độ học tập", icon: TrendingUp },
      { to: "/bookmarks", label: "Bài học đã lưu", icon: Bookmark },
      { to: "/profile", label: "Hồ sơ cá nhân", icon: UserRound },
      { to: "/settings", label: "Cài đặt", icon: Settings },
    ],
  },
];
export function Sidebar() {
  return (
    <aside className="sidebar">
      <nav aria-label="Góc học tập">
        {sidebarGroups.map((group) => (
          <div className="sidebar-group" key={group.name}>
            <span>{group.name}</span>
            {group.items.map(({ to, label, icon: Icon }) => (
              <NavLink to={to} key={to} end>
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-tip">
        <Headphones size={26} />
        <strong>Một chút mỗi ngày</strong>
        <p>15 phút tập trung hôm nay tạo nên sự khác biệt ngày mai.</p>
        <Link to="/lessons">
          Luyện nghe ngay <ChevronRight size={15} />
        </Link>
      </div>
    </aside>
  );
}
export function Toast() {
  const { toast, setToast } = useApp();
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);
  return toast ? (
    <div className="toast" role="status">
      {toast}
      <button
        className="icon-btn"
        aria-label="Đóng thông báo"
        onClick={() => setToast("")}
      >
        <X size={16} />
      </button>
    </div>
  ) : null;
}
