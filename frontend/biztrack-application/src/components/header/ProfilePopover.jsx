import React, { useState } from "react";
import { Popover } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export default function ProfilePopper({
  anchorEl,
  handleClose,
  handleLogout,
  handleOpenProfile, // 👈 Receive as prop
}) {
  const [hovered, setHovered] = useState(-1);
  const open = Boolean(anchorEl);

  const POPPER_ITEMS = [
    {
      key: "myProfile",
      title: "My Profile",
      icon: <PersonOutlinedIcon fontSize="small" className="text-gray-600" />,
      action: () => {
        handleOpenProfile(); // 👈 Open profile page
      },
    },
    {
      key: "logout",
      title: "Logout",
      icon: <LogoutRoundedIcon fontSize="small" className="text-gray-600" />,
      action: () => {
        handleClose();
        handleLogout();
      },
    },
  ];

  return (
    <Popover
      id="profile-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      PaperProps={{
        className: "rounded-lg shadow-lg w-48 mt-3",
      }}
    >
      <div className="flex flex-col py-2">
        {POPPER_ITEMS.map((item, index) => (
          <button
            key={item.key}
            onClick={item.action}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(-1)}
            className={`flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left transition ${
              hovered === index ? "bg-gray-100" : ""
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.title}
          </button>
        ))}
      </div>
    </Popover>
  );
}
