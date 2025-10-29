import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation // ADD THIS IMPORT
} from "react-router-dom";
import { useSelector, useDispatch, Provider } from "react-redux";
import { store, authActions } from "./store";
import Cookies from "js-cookie";
import { routes } from "./config/routes";
import Login from "./views/sign-in/Login";
import ForgotPassword from "./views/sign-in/ForgotPassword";
import { ThemeProvider } from "./components/theme/ThemeContext";
import MainLayout from "./layout";
import AppRoutes from "./components/AppRoutes";
import NotFound from "./components/notfound";
import Unauthorized from "./components/notfound/Unauthorized";
import { CircularProgress } from "@mui/material";
import OTPInput from "./views/sign-in/ForgotPassword/OTPInput";

const ThemedMainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth.value);

  let user = null;

  useEffect(() => {
    if (!authState && isLoadingAuth) {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          
          // Handle Mongoose document format if present
          let cleanUser = parsedUser;
          if (parsedUser && parsedUser._doc) {
            console.log("🔧 ThemedMainLayout: Extracting user from _doc");
            cleanUser = parsedUser._doc;
          }
          
          console.log("🔍 ThemedMainLayout: Setting auth with user:", cleanUser);
          dispatch(authActions.setAuth(cleanUser));
        } catch (e) {
          console.error("ThemedMainLayout: Error parsing user from cookie:", e);
          Cookies.remove("user");
          dispatch(authActions.setAuth(null));
        }
      } else {
        // No user cookie found
        setIsLoadingAuth(false);
      }
    }
    setIsLoadingAuth(false);
  }, [authState, isLoadingAuth, dispatch]);

  // Process user data for the layout
  if (authState) {
    try {
      user = typeof authState === "string" ? JSON.parse(authState) : authState;
      
      // Handle Mongoose document format
      if (user && user._doc) {
        user = user._doc;
      }
    } catch (e) {
      console.error("ThemedMainLayout: Error parsing authState from Redux:", e);
      user = null;
      Cookies.remove("user");
      dispatch(authActions.setAuth(null));
    }
  }

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <CircularProgress color="primary" size={60} />
        <p className="mt-4 text-xl text-gray-700">
          Loading application...
        </p>
      </div>
    );
  }

  if (!user) {
    console.log("❌ ThemedMainLayout: No user, redirecting to login");
    return <Navigate to="/" replace />;
  }

  console.log("✅ ThemedMainLayout: User authenticated:", user);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <MainLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
      <Outlet />
    </MainLayout>
  );
};

// Route Debugger Component
const RouteDebugger = () => {
  const user = useSelector((state) => state.auth.value);
  const location = useLocation();
  
  console.log("🔍 ROUTE DEBUGGER:");
  console.log("🔍 Current path:", location.pathname);
  console.log("🔍 User from Redux:", user);
  
  // Check localStorage too
  try {
    const storedUser = localStorage.getItem("user");
    console.log("🔍 User from localStorage:", storedUser ? JSON.parse(storedUser) : 'None');
  } catch (error) {
    console.error("🔍 Error reading localStorage:", error);
  }
  
  return null;
};

const App = () => {
  // Debug routes configuration
  console.log("🔍 ROUTES CONFIGURATION:");
  routes.filter(route => route.isPrivate).forEach(route => {
    console.log(`🔍 Route: ${route.path}, Allowed Roles: ${route.allowedRoles}`);
  });

  // Specifically check the super-admin route
  const superAdminRoute = routes.find(route => route.path === "/dashboard/super-admin");
  console.log("🔍 SUPER ADMIN ROUTE DETAILS:", superAdminRoute);

  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<OTPInput />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/not-found" element={<NotFound />} />
            
            {/* TEMPORARY: Direct super-admin route for testing */}
            <Route 
              path="/temp-super-admin" 
              element={
                <AppRoutes allowedRoles={["SUPER_ADMIN"]}>
                  <div style={{ padding: '20px' }}>
                    <h1>Super Admin Dashboard - TEMPORARY</h1>
                    <p>If you can see this, SUPER_ADMIN role is working!</p>
                    <p>Your role: SUPER_ADMIN</p>
                  </div>
                </AppRoutes>
              } 
            />
            
            {/* Protected routes */}
            <Route element={<ThemedMainLayout />}>
              {/* Route Debugger - remove in production */}
              <Route path="*" element={<RouteDebugger />} />
              
              {routes
                .filter((route) => route.isPrivate)
                .map((route) => (
                  <Route
                    key={route.path}
                    path={
                      route.path.startsWith("/")
                        ? route.path.substring(1)
                        : route.path
                    }
                    element={
                      <AppRoutes allowedRoles={route.allowedRoles}>
                        {route.element}
                      </AppRoutes>
                    }
                  />
                ))}
              
              {/* Default redirect */}
              <Route
                path="/"
                element={<Navigate to="/dashboard/super-admin" replace />}
              />
              
              {/* Profile route */}
              {routes
                .filter((route) => route.path === "/profile" && route.isPrivate)
                .map((route) => (
                  <Route
                    key={route.path}
                    path={route.path.substring(1)}
                    element={
                      <AppRoutes allowedRoles={route.allowedRoles}>
                        {route.element}
                      </AppRoutes>
                    }
                  />
                ))}
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;