import React, { useState } from "react";
import { Menu, Bell, User as UserIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { authActions } from "../../store";
import ProfilePopper from "./ProfilePopover";

import { useTheme } from "../theme/ThemeContext";

export default function Topbar({ toggleSidebar }) {
  const user = useSelector((state) => state.auth.value);
  const role = user?.role?.replace(/\s+/g, "_");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { logoUrl, primaryColor } = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    Cookies.remove("user");
    dispatch(authActions.logout());
    navigate("/");
  };

  const handleOpenProfile = () => {
    handleClose();
    navigate("/profile");
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
    <header
      className="shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10"
      style={{ backgroundColor: primaryColor || "#6f42c1" }}
    >
      <div className="flex items-center">
        <button className="mr-2 text-white lg:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        <img
          src={logoUrl}
          alt="Business Logo"
          className="h-8 md:h-10 w-auto lg:hidden"
          style={{ maxHeight: "40px" }}
        />
      </div>

      <div className="flex items-center space-x-4 relative">
        <button className="relative p-1 text-white hover:bg-opacity-80 rounded-full transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>

        <div
          className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded hover:bg-opacity-80 transition"
          onClick={handleClick}
        >
          <div
            className="text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-semibold p-1"
            style={{
              backgroundColor: `color-mix(in srgb, ${primaryColor} 50%, white)`,
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="hidden md:inline text-xs text-white">
            <span className="text-xs font-semibold">Hi, {user?.name}</span>
            <br />
            <span className="text-xs font-medium">{role}</span>
          </div>
        </div>

        <ProfilePopper
          anchorEl={anchorEl}
          handleClose={handleClose}
          handleLogout={handleLogout}
          handleOpenProfile={handleOpenProfile}
        />
      </div>
    </header>
  );
}
