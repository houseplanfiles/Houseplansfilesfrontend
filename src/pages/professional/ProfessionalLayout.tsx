import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ProfessionalSidebar from "./ProfessionalSidebar";
import Navbar from "@/components/Navbar";
import { Menu } from "lucide-react";

const ProfessionalLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar - HIGHEST Z-INDEX */}
      <div className="sticky top-0 z-[100]">
        <Navbar />
      </div>

      <div className="flex flex-1 h-[calc(100vh-80px)]">
        {/* Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            style={{ top: "80px" }} // Navbar ke neeche se start
          />
        )}

        {/* Sidebar */}
        <ProfessionalSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-soft-teal w-full">
          {/* Mobile Header */}
          <header className="md:hidden sticky top-0 bg-white shadow-sm z-30 p-4 flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 ml-4">
              Professional Panel
            </h2>
          </header>

          <main className="p-4 md:p-8">
            <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLayout;
