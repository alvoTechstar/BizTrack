import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MENU } from "../../config/Menu";
import { normalizeRole } from "../../utilities/Sharedfunctions";
import { X } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const user = useSelector((state) => state.auth.value);
  const location = useLocation();
  const role = normalizeRole(user?.role);

  const { logoUrl, primaryColor } = useTheme();

  const allowedMenuItems = MENU.filter((item) =>
    item.permissions.includes(role)
  );

  const handleItemClick = () => {
    if (isOpen && window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-30 transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:h-auto`}
      >
        {/* Header for mobile */}
        <div className="flex items-center justify-between px-4 py-3 border-b lg:hidden">
          <img
            src={logoUrl}
            alt="Business Logo"
            className="h-8 object-contain"
          />
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Logo for desktop */}
        <div className="hidden lg:flex items-center justify-center py-4">
          <img
            src={logoUrl}
            alt="Business Logo"
            className="h-8 object-contain"
          />
        </div>

        {/* Menu items */}
        <nav className="px-3 py-4 overflow-y-auto h-full">
          <ul className="space-y-1">
            {allowedMenuItems.length > 0 ? (
              allowedMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.key}>
                    <Link
                      to={item.path}
                      onClick={handleItemClick}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? "bg-opacity-10"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? `${primaryColor}1A`
                          : undefined,
                        color: isActive ? primaryColor : undefined,
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No menu items available for your role
              </div>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
