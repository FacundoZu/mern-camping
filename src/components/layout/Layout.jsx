import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import 'react-toastify/dist/ReactToastify.css'

export const Layout = () => {
  const location = useLocation();

  const isHomePage = location.pathname === "/home" || location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${isHomePage ? "" : "bg-gray-200"}`}>
        <Outlet />
      </main>
      <Footer />

    </div>
  );
};

