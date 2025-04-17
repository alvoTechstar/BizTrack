import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Popover, Avatar, Badge } from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function Header({ color = "#2563eb" }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar position="static" elevation={0} className="bg-white shadow-md">
      <Toolbar className="flex justify-between px-4 sm:px-8">
        {/* Left: Logo or App Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center">
            A
          </div>
          <h1 className="text-lg font-semibold text-gray-800">AppName</h1>
        </div>

        {/* Right: Notification + Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification */}
          <IconButton>
            <Badge variant="dot" color="error">
              <NotificationsNoneRoundedIcon className="text-gray-600" />
            </Badge>
          </IconButton>

          {/* Avatar */}
          <IconButton onClick={handleAvatarClick}>
            <Avatar sx={{ bgcolor: color }} className="w-8 h-8">
              <PersonOutlineOutlinedIcon />
            </Avatar>
          </IconButton>

          {/* Popover Menu */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            className="mt-2"
          >
            <div className="flex flex-col py-2 min-w-[150px] text-sm">
              <button
                onClick={() => {
                  // navigate("/profile");
                  handleClosePopover();
                }}
                className="px-4 py-2 text-left hover:bg-gray-100"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  // navigate("/logout");
                  handleClosePopover();
                }}
                className="px-4 py-2 text-left hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          </Popover>
        </div>
      </Toolbar>
    </AppBar>
  );
}
