import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { store } from "./store";
import Cookies from "js-cookie";
import { routes } from "./config/routes";
import Login from "./views/sign-in/Login";
import MainLayout from "./layout";
import ProfilePage from "./views/main-app/profile/ProfilePage";
import ForgotPassword from "./views/sign-in/ForgotPassword";

const PrivateWrapper = ({ children, allowedRoles }) => {
  const auth = useSelector((state) => state.auth.value);
  const cookieUser = Cookies.get("user");

  // Check authentication
  if (!auth || !cookieUser) {
    return <Navigate to="/" replace />;
  }

  // Parse user data
  let user;
  try {
    user = typeof auth === "string" ? JSON.parse(auth) : auth;
  } catch (e) {
    console.error("Error parsing auth user:", e);
    return <Navigate to="/" replace />;
  }

  // Check role
  const role = user?.role || user?.user?.role;
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/modal" element={<App />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          {routes
            .filter((route) => route.isPrivate)
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PrivateWrapper allowedRoles={route.allowedRoles}>
                    {route.element}
                  </PrivateWrapper>
                }
              />
            ))}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
