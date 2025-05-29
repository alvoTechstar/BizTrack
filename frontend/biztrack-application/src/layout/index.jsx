import React from "react"; // No useState here, it's managed by ThemedMainLayout
import Sidebar from "../components/menu";
import Topbar from "../components/header";
import Footer from "../components/footer";

// MainLayout now accepts sidebarOpen and toggleSidebar as props
const MainLayout = ({ children, sidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen} // Use prop
        toggleSidebar={toggleSidebar} // Use prop
      />

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1 w-0">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />{" "}
        {/* Pass toggleSidebar to Topbar */}
        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
