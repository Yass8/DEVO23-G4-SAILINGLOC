import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import AdminHeader from "../../components/admin/AdminNavbar.jsx";
import Preloader from "../../components/common/Preloader.jsx";
import ScrollToTop from "../../components/common/ScrollToTop.jsx";
import { isTokenValid } from "../../services/authService.js";
import { useEffect } from "react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/admin/sl");
    }
  }, [navigate]);

  return (
    <div className="bg-sand text-black min-h-screen flex flex-col">
      <Preloader />
      <ScrollToTop />

      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="p-4 sm:ml-64 mt-16">
        <Outlet />
      </main>
    </div>
  );
}
