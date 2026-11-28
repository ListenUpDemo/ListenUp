import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import LearningLayout from "../../layouts/LearningLayout";
import AuthLayout from "../../layouts/AuthLayout";
import Home from "../../pages/Home";
import Lessons from "../../pages/Lessons";
import Topics from "../../pages/Topics";
import Shop from "../../pages/Shop";
import LessonDetail from "../../pages/LessonDetail";
import Practice from "../../pages/Practice";
import Result from "../../pages/Result";
import Dashboard from "../../pages/Dashboard";
import Bookmarks from "../../pages/Bookmarks";
import { AuthPage, ProfilePage, SettingsPage } from "../../pages/Account";
import NotFound from "../../pages/NotFound";
import { Toast } from "../../components/layout/Navigation";
export default function AppRouter() {
  const location = useLocation();
  useEffect(() => {
    const section =
      location.hash === "#campaigns"
        ? document.getElementById("campaigns")
        : null;
    if (section) section.scrollIntoView();
    else window.scrollTo(0, 0);
    const names: Record<string, string> = {
      "/": "Hành trình",
      "/shop": "Cửa hàng",
      "/adventure/daily": "Luyện tập hằng ngày",
      "/lessons": "Thư viện bài nghe",
      "/topics": "Khám phá chủ đề",
      "/dashboard": "Góc học tập",
      "/progress": "Tiến độ học tập",
      "/bookmarks": "Bài học đã lưu",
      "/login": "Đăng nhập",
      "/register": "Đăng ký",
      "/profile": "Hồ sơ cá nhân",
      "/settings": "Cài đặt",
    };
    const fallback = location.pathname.startsWith("/adventure/")
      ? "Chủ đề đời thường"
      : location.pathname.startsWith("/practice/")
        ? "Luyện nghe"
        : "Bài học";
    document.title = `${names[location.pathname] ?? fallback} | ListenUp`;
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#main">
        Bỏ qua đến nội dung chính
      </a>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="lessons/:slug" element={<LessonDetail />} />
          <Route path="topics" element={<Topics />} />
          <Route path="topics/:slug" element={<Lessons />} />
          <Route path="shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<LearningLayout />}>
          <Route path="practice/:lessonId" element={<Practice />} />
          <Route path="practice/:lessonId/result" element={<Result />} />
          <Route
            path="adventure/campaign/:campaignId"
            element={<Practice kind="campaign" />}
          />
          <Route path="adventure/daily" element={<Practice kind="daily" />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="progress" element={<Dashboard />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<AuthPage key="login" />} />
          <Route
            path="register"
            element={<AuthPage key="register" register />}
          />
        </Route>
      </Routes>
      <Toast />
    </>
  );
}
