import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components/layout/Navigation";
export default function PublicLayout() {
  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
