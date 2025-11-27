import React, { useState } from "react";
import Sidebar from "../components/menu";
import Topbar from "../components/header";
import Footer from "../components/footer";
import MyProfile from "../views/main-app/profile";

const MainLayout = ({ children, sidebarOpen, toggleSidebar }) => {
  const [profileViewOpen, setProfileViewOpen] = useState(false);

  const handleOpenProfile = () => setProfileViewOpen(true);
  const handleCloseProfile = () => setProfileViewOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} openProfile={handleOpenProfile} />

        {/* Main content with adjusted margins */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {" "}
          {/* Changed padding here */}
          <div
            className="h-full mx-auto"
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              maxWidth: "calc(100% - 20px)" /* Adjusts for the margins */,
            }}
          >
            {/* Render the profile view or children */}
            {profileViewOpen ? (
              <MyProfile onClose={handleCloseProfile} />
            ) : (
              children
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
