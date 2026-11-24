import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "../components/layout/Navigation";
export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="container dashboard-shell">
        <Sidebar />
        <main id="main" className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
