
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, ClipboardList, FileText, Home, Menu, Search, Settings, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();

  // If on mobile, sidebar is closed by default
  React.useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-primary-100 text-primary-700 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        )
      }
    >
      <Icon size={20} />
      {isOpen && <span>{label}</span>}
    </NavLink>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar toggle button for mobile */}
      {isMobile && !isOpen && (
        <Button 
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50"
        >
          <Menu size={20} />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 z-50",
          isOpen ? "w-64" : "w-16",
          isMobile && isOpen ? "fixed inset-y-0 left-0" : "",
          isMobile && !isOpen ? "hidden" : ""
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className={cn(
            "flex items-center h-16 px-4 border-b border-gray-200",
            isOpen ? "justify-between" : "justify-center"
          )}>
            {isOpen && (
              <div className="font-semibold text-lg text-primary-700">OYO Case Compass</div>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-2">
            <NavItem to="/" icon={Home} label="Dashboard" />
            <NavItem to="/cases" icon={ClipboardList} label="Cases" />
            <NavItem to="/reports" icon={BarChart3} label="Reports" />
            <NavItem to="/search" icon={Search} label="Search" />
          </nav>

          {/* Bottom section */}
          <div className="mt-auto border-t border-gray-200 p-2">
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </aside>
    </>
  );
};
