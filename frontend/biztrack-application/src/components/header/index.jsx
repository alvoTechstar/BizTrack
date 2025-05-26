import React, { useState } from "react";
import { Menu, Bell, User as UserIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { authActions } from "../../store";
import ProfilePopper from "./ProfilePopover";

export default function Topbar({ toggleSidebar }) {
  const user = useSelector((state) => state.auth.value);
  const role = user?.role?.replace(/\s+/g, "_");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    Cookies.remove("user");
    dispatch(authActions.logout());
    navigate("/login");
  };

  const handleOpenProfile = () => {
    handleClose(); // Close the popper
    navigate("/profile"); // Navigate to profile route
  };
  const getInitials = (roleStr) => {
    if (!roleStr) return "NA";
    const parts = roleStr
      .replace(/[-_]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0].toUpperCase());
    return parts.slice(0, 2).join("");
  };

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Sidebar Toggle */}
      <div className="flex items-center">
        <button
          className="mr-4 text-gray-600 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 lg:hidden">
          BizTrack
        </h1>
      </div>

      {/* Right Side: Notifications + Profile */}
      <div className="flex items-center space-x-4 relative">
        <button className="relative p-1 text-gray-600 hover:bg-gray-100 rounded-full transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile Button */}
        <div
          className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition"
          onClick={handleClick}
        >
          {/* Initials Circle */}
          <div className="bg-gray-500 text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-semibold p-1">
            {getInitials(role)}
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            Hi, {role}
          </span>
        </div>

        {/* Profile Dropdown Popper */}
        <ProfilePopper
          anchorEl={anchorEl}
          handleClose={handleClose}
          handleLogout={handleLogout}
          handleOpenProfile={handleOpenProfile} // 👈 now navigates to /profile
        />
      </div>
    </header>
  );
}
