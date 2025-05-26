import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MENU } from "../../config/Menu";
import { normalizeRole } from "../../utilities/Sharedfunctions";
import { X } from "lucide-react";
import BiztrackLogo from "../../assets/Logos/biztrack-logo.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const user = useSelector((state) => state.auth.value);
  const location = useLocation();
  const role = normalizeRole(user?.role);

  // Debug logs
  console.log("Current user role:", user?.role);
  console.log("Normalized role:", role);
  console.log("All menu items:", MENU);

  // Filter menu items
  const allowedMenuItems = MENU.filter((item) => {
    const isAllowed = item.permissions.includes(role);
    console.log(`Checking ${item.key}:`, isAllowed);
    return isAllowed;
  });

  console.log("Allowed menu items:", allowedMenuItems);

  // Auto-close sidebar when a menu item is clicked (mobile)
  const handleItemClick = () => {
    if (isOpen && window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`bg-white shadow-md w-64 fixed top-0 left-0 h-full z-30 transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:h-auto`}
      >
        {/* Close icon for mobile */}
        <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b">
          <img
            src={BiztrackLogo}
            alt="BizTrack Logo"
            className="h-8 object-contain"
          />
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* App name (desktop) */}
        <div className="hidden lg:block px-4 py-3 text-xl font-bold ">
          <img src={BiztrackLogo} className="ml-1 h-10 mx-12" />
        </div>

        {/* Menu */}
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {allowedMenuItems.length > 0 ? (
              allowedMenuItems.map((item) => (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={handleItemClick}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))
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
