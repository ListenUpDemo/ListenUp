import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui";
export default function NotFound() {
  return (
    <div className="container page-content">
      <EmptyState
        title="Trang này chưa có trong hành trình"
        description="Đường dẫn có thể đã thay đổi. Cùng trở lại thư viện để tìm bài nghe tiếp theo nhé."
        action={
          <Link className="btn btn-primary" to="/lessons">
            Về thư viện bài học
          </Link>
        }
      />
    </div>
  );
}
