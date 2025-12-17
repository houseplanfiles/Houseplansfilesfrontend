import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutGrid,
  Package,
  PlusSquare,
  User,
  LogOut,
  ClipboardList,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/features/users/userSlice";

const navLinks = [
  { name: "Dashboard", path: "/professional", icon: LayoutGrid },
  { name: "My Products", path: "my-products", icon: Package },
  { name: "Add New Product", path: "add-product", icon: PlusSquare },
  { name: "My Orders", path: "my-orders", icon: ClipboardList },
  { name: "My Profile", path: "profile", icon: User },
];

const ProfessionalSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const baseClasses =
    "flex items-center w-full p-3.5 rounded-lg text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-primary text-white";
  const inactiveClasses = "text-gray-200 hover:bg-slate-700";

  return (
    <aside
      style={{ top: '80px' }} // Navbar ke neeche se start - IMPORTANT!
      className={`
        fixed md:sticky 
        left-0 
        bg-slate-900 text-white 
        p-4 
        flex flex-col 
        w-64 
        transition-transform duration-300 ease-in-out
        z-50
        h-[calc(100vh-80px)]
        md:shrink-0
        overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Professional</h2>
        
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2 flex-1 min-h-0 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/professional"}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            onClick={() => setIsOpen(false)}
          >
            <link.icon className="mr-3 h-5 w-5 shrink-0" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-4 pt-4 border-t border-slate-700 shrink-0">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default ProfessionalSidebar;
