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
import { normalizeRole } from "./utilities/Sharedfunctions";
import { ThemeProvider } from "./components/theme/ThemeContext";
import MainLayout from "./layout";
import AppRoutes from "./components/AppRoutes";
import NotFound from "./components/notfound";
import Unauthorized from "./components/notfound/Unauthorized";
import { CircularProgress } from "@mui/material";

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
          const normalizedUser = {
            ...parsedUser,
            role: normalizeRole(parsedUser.role),
          };
          dispatch(authActions.setAuth(normalizedUser));
        } catch (e) {
          console.error("ThemedMainLayout: Error parsing user from cookie:", e);
          Cookies.remove("user");
          dispatch(authActions.setAuth(null));
        }
      }
    }
    setIsLoadingAuth(false);
  }, [authState, isLoadingAuth, dispatch]);

  if (authState) {
    try {
      user = typeof authState === "string" ? JSON.parse(authState) : authState;
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
        <CircularProgress color="primary" size={60} />{" "}
        {/* Your loading animation */}
        <p className="mt-4 text-xl text-gray-700">
          Loading application...
        </p>{" "}
        {/* Optional: keep the text */}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <MainLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
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
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/reset-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route element={<ThemedMainLayout />}>
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
              <Route
                path="/"
                element={<Navigate to="/dashboard/super-admin" replace />}
              />
              {routes
                .filter((route) => route.path === "/profile" && route.isPrivate)
                .map((route) => (
                  <Route
                    key={route.path}
                    path={route.path.substring(1)}
                    element={
                      <AuthWrapper allowedRoles={route.allowedRoles}>
                        {route.element}
                      </AuthWrapper>
                    }
                  />
                ))}
            </Route>
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
