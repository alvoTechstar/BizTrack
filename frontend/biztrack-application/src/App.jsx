import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
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

  useEffect(() => {
    // Only load from cookie if Redux is empty
    if (!authState) {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          const cleanUser = parsedUser._doc || parsedUser;
          dispatch(authActions.setAuth(cleanUser));
        } catch (e) {
          console.error("Error parsing user from cookie:", e);
          Cookies.remove("user");
          dispatch(authActions.setAuth(null));
        }
      }
    }
    setIsLoadingAuth(false);
  }, [authState, dispatch]);

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <CircularProgress color="primary" size={60} />
        <p className="mt-4 text-lg text-gray-600">Loading application...</p>
      </div>
    );
  }

  if (!authState) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout 
      sidebarOpen={sidebarOpen} 
      toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      <Outlet />
    </MainLayout>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<OTPInput />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/not-found" element={<NotFound />} />

            {/* Protected Routes */}
            <Route element={<ThemedMainLayout />}>
              {routes
                .filter((route) => route.isPrivate)
                .map((route) => (
                  <Route
                    key={route.path}
                    path={route.path.startsWith("/") ? route.path.substring(1) : route.path}
                    element={
                      <AppRoutes allowedRoles={route.allowedRoles}>
                        {route.element}
                      </AppRoutes>
                    }
                  />
                ))}
            </Route>

            {/* Catch All - 404 */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;