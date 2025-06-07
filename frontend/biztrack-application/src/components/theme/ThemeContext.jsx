import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { mockBusinesses } from "../../config/Mockusers";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    logoUrl: "/default-logo.png",
    primaryColor: "#007bff",
  });
  const [loadingTheme, setLoadingTheme] = useState(true);

  const location = useLocation();
  const authUser = useSelector((state) => state.auth.value);

  const getTheme = (user, businessIdFromURL) => {
    let parsedUser = user;

    if (typeof user === "string") {
      try {
        parsedUser = JSON.parse(user);
      } catch (e) {
        console.error("Error parsing user JSON:", e);
        parsedUser = null;
      }
    }

    const businessId =
      businessIdFromURL || parsedUser?.associatedBusinessId;

    if (!businessId) {
      return {
        logoUrl: "/logos/biztrack-default-logo.png",
        primaryColor: "#118eed",
      };
    }

    const matchedBusiness = mockBusinesses.find(
      (biz) => biz.id === businessId
    );

    if (matchedBusiness) {
      return {
        logoUrl: matchedBusiness.logoUrl,
        primaryColor: matchedBusiness.primaryColor,
      };
    }

    return {
      logoUrl: "/logos/biztrack-default-logo.png",
      primaryColor: "#118eed",
    };
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bizId = params.get("biz"); // e.g. /login?biz=biz-kiosk-quickeats

    const selectedTheme = getTheme(authUser, bizId);
    setTheme(selectedTheme);
    setLoadingTheme(false);
  }, [authUser, location.search]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
  }, [theme.primaryColor]);

  const contextValue = useMemo(
    () => ({
      theme,
    }),
    [theme]
  );

  if (loadingTheme) return <div>Loading theme...</div>;

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context.theme;
};
