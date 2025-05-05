// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { store } from "./store"; // Redux store
import Cookies from "js-cookie";
import { routes } from "./config/routes";
import Login from "./views/sign-in/Login";

// PrivateRoute Component
const PrivateRoute = ({ element, permissions }) => {
  const auth = useSelector((state) => state.auth.value);
  const cookieUser = Cookies.get("user");

  if (!auth || !cookieUser) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = typeof auth === "string" ? JSON.parse(auth) : auth;
  } catch (e) {
    console.error("Error parsing auth user:", e);
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || user?.user?.role || user?.userRole;
  const isAllowed = Array.isArray(permissions) ? permissions.includes(role) : true;

  console.log("User role:", role);
  console.log("Route permissions:", permissions);

  return isAllowed ? element : <Navigate to="/not-authorized" replace />;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Secure routes */}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.isprivate ? (
                  <PrivateRoute
                    element={route.element}
                    permissions={route.permissions}
                  />
                ) : (
                  route.element
                )
              }
            />
          ))}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
