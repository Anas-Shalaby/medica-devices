import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onNavigate?: () => void;
}

const NavItem = ({ to, icon, label, onNavigate }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = () => {
    navigate(to);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-dashboard-blue text-white"
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-dashboard-blue">
            Data Control
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            onNavigate={onClose}
          />
          <NavItem
            to="/devices"
            icon={<Package className="h-5 w-5" />}
            label="Devices"
            onNavigate={onClose}
          />
          <NavItem
            to="/orders"
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Orders"
            onNavigate={onClose}
          />
          <NavItem
            to="/users"
            icon={<Users className="h-5 w-5" />}
            label="Users"
            onNavigate={onClose}
          />
          <NavItem
            to="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            onNavigate={onClose}
          />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
