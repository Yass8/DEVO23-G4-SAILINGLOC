// pages/client/Customer.jsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Preloader from "../../components/common/Preloader";
import ScrollToTop from "../../components/common/ScrollToTop";
import Navbar from "../../components/client/Navbar";
import Sidebar from "../../components/client/Sidebar";
import { useEffect } from "react";
import { isTokenValid } from "../../services/authService";

export default function Customer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="bg-[#f5f0e9] text-black min-h-screen flex flex-col">
      <Preloader />
      <ScrollToTop />

      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
      />

      {/* Contenu principal */}
      <main className="p-4 sm:ml-64 mt-16">
        <Outlet />
      </main>
    </div>
  );
}
