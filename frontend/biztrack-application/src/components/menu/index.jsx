import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MENU } from "../../config/Menu";
import { X } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { normalizeRole } from "../../utilities/Sharedfunctions"; 

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const user = useSelector((state) => state.auth.value);
  const location = useLocation();
  const { logoUrl, primaryColor } = useTheme();

  // Memoize normalized role
  const normalizedRole = useMemo(() => {
    if (!user?.role) {
      console.log("   - No user role found");
      return "";
    }
    const normalized = normalizeRole(user.role);
    console.log("   - Normalized role:", normalized);
    return normalized;
  }, [user?.role]);

  // Memoize allowed menu items
  const allowedMenuItems = useMemo(() => {
    if (!normalizedRole) {
      console.log("   - No normalized role, returning empty menu");
      return [];
    }
    
    const filteredItems = MENU.filter((item) => {
      const hasPermission = item.permissions.includes(normalizedRole);
      console.log(`   - Checking ${item.key}: permissions ${item.permissions} includes ${normalizedRole}? ${hasPermission}`);
      return hasPermission;
    });
    
    console.log("   - Final allowed menu items:", filteredItems.map(item => item.key));
    return filteredItems;
  }, [normalizedRole]);

  const handleItemClick = () => {
    if (isOpen && window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          onClick={toggleSidebar}
          style={{
            backdropFilter: "blur(2px)",
            backgroundColor: "rgba(92, 91, 91, 0.1)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b lg:hidden">
          <img
            src={logoUrl}
            alt="Business Logo"
            className="h-8 w-auto object-contain"
          />
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden lg:flex items-center justify-center py-4 border-b">
          <img
            src={logoUrl}
            alt="Business Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-4 overflow-y-auto h-[calc(100%-60px)] lg:h-auto">
          {allowedMenuItems.length > 0 ? (
            <ul className="space-y-1">
              {allowedMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.key}>
                    <Link
                      to={item.path}
                      onClick={handleItemClick}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "text-opacity-100"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      style={{
                        backgroundColor: isActive ? `${primaryColor}15` : undefined,
                        color: isActive ? primaryColor : undefined,
                      }}
                    >
                      <span className="mr-3 flex-shrink-0">{item.icon}</span>
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-gray-500">
                No menu items available for {normalizedRole || "your role"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                User Role: {user?.role} → Normalized: {normalizedRole}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                <p>Available permissions in MENU:</p>
                <p>{JSON.stringify([...new Set(MENU.flatMap(item => item.permissions))])}</p>
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;