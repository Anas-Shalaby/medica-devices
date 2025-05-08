<<<<<<< HEAD
import React from "react";
import { NavLink } from "react-router-dom";
=======
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
>>>>>>> 1bc800f (init)
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Laptop,
  Database,
  Settings,
  ChevronLeft,
  ListOrdered,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
  onNavigate?: () => void;
}

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/devices", icon: Laptop, label: "Devices" },
  { to: "/orders", icon: ListOrdered, label: "Orders" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const NavItem = ({
  to,
  icon: Icon,
  label,
  isOpen,
  onNavigate,
}: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = () => {
    navigate(to);
    setTimeout(() => {
      onNavigate?.();
    }, 100);
  };

  return (
<<<<<<< HEAD
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center p-3 mb-1 rounded-lg transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-gray-200",
          !isOpen && "justify-center"
        )
      }
=======
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center p-3 mb-1 rounded-lg transition-colors w-full text-left",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-gray-200",
        !isOpen && "justify-center"
      )}
>>>>>>> 1bc800f (init)
    >
      <Icon className={cn("h-5 w-5", isOpen && "mr-3")} />
      {isOpen && <span>{label}</span>}
    </button>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector("aside");
      const isClickInside = sidebar?.contains(event.target as Node);

      if (isOpen && !isClickInside) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  return (
<<<<<<< HEAD
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-20",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && <span className="font-bold text-lg">Admin Panel</span>}
        <button
          className={cn(
            "p-1 rounded-full hover:bg-gray-200",
            !isOpen && "mx-auto"
          )}
          onClick={toggleSidebar}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              !isOpen && "rotate-180"
            )}
          />
        </button>
      </div>
      <nav className="p-3">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isOpen={isOpen}
          />
        ))}
      </nav>
    </aside>
=======
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-30",
          isOpen ? "w-64" : "w-16",
          "md:translate-x-0",
          !isOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen && <span className="font-bold text-lg">Admin Panel</span>}
          <button
            className={cn(
              "p-1 rounded-full hover:bg-gray-200",
              !isOpen && "mx-auto"
            )}
            onClick={toggleSidebar}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                !isOpen && "rotate-180"
              )}
            />
          </button>
        </div>
        <nav className="p-3">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isOpen={isOpen}
              onNavigate={toggleSidebar}
            />
          ))}
        </nav>
      </aside>
    </>
>>>>>>> 1bc800f (init)
  );
};

export default Sidebar;
