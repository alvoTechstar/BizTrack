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
      {/* Sidebar container */}
      <aside
        className={`bg-white shadow-md w-64 fixed top-0 left-0 h-full z-30 transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:h-auto`}
      >
        <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b">
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

        <div className="hidden lg:flex items-center justify-center px-4 py-3 text-xl font-bold">
          <img
            src={logoUrl}
            alt="Business Logo"
            className="h-10 mx-auto object-contain justify-start ml-6"
            style={{ maxHeight: "30px" }}
          />
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
                        ? "bg-opacity-10"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    style={{
                      backgroundColor:
                        location.pathname === item.path
                          ? `${primaryColor}1A`
                          : "",
                      color:
                        location.pathname === item.path ? primaryColor : "",
                    }}
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
