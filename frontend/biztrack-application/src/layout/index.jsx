// MainLayout.jsx
import React, { useState } from "react";
import Sidebar from "../components/menu";
import Topbar from "../components/header";
import Footer from "../components/footer";

import MyProfile from "../views/main-app/profile";
// You might pass a modal component or a render prop for modals here
// const MainLayout = ({ children, sidebarOpen, toggleSidebar, activeModal }) => {
const MainLayout = ({ children, sidebarOpen, toggleSidebar }) => { // Keep it simple for now

  const [profileViewOpen, setProfileViewOpen] = useState(false);

  const handleOpenProfile = () => setProfileViewOpen(true);
  const handleCloseProfile = () => setProfileViewOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 relative">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col flex-1 w-0">
        <Topbar toggleSidebar={toggleSidebar} openProfile={handleOpenProfile} />

        <main className="flex-1 overflow-y-auto p-4 relative"> {/* Add relative positioning here */}
          <div className="max-w-7xl mx-auto">
            {/* Render the profile view or children */}
            {profileViewOpen ? (
              <MyProfile onClose={handleCloseProfile} />
            ) : (
              children
            )}
            {/* Any modals you want to appear *within* the layout can be rendered here */}
            {/* Example: If you had a state for which modal to show */}
            {/* {activeModal && activeModal} */}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;