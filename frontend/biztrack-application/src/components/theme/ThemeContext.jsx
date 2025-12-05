import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import BiztrackLogo from "../../assets/Logos/biztrack-logo.png";
import HotelLogo from "../../assets/Logos/cbl.png";
import KioskLogo from "../../assets/Logos/ria.png";
import HospitalLogo from "../../assets/Logos/isw.png";

const ThemeContext = createContext(null);

// Logo mapping based on business type
const BUSINESS_LOGO_MAP = {
  "kiosk": KioskLogo,
  "hotel": HotelLogo,
  "hospital": HospitalLogo,
  "kiosk_admin": KioskLogo,
  "hotel_admin": HotelLogo,
  "hospital_admin": HospitalLogo,
  "general": BiztrackLogo,
  "default": BiztrackLogo
};

// Default colors
const DEFAULT_COLORS = {
  primary: "#118eed",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  secondary: "#64748b"
};

// Default theme
const DEFAULT_THEME = {
  primaryColor: "#118eed",
  logoUrl: BiztrackLogo,
  businessType: "general",
  businessName: "Business",
  colors: DEFAULT_COLORS
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const authState = useSelector((state) => state.auth);


  useEffect(() => {
    const loadBusinessTheme = () => {
      // If no auth state, return default theme
      if (!authState) {
        return DEFAULT_THEME;
      }

      let userData = null;

      // Try different possible Redux structures
      if (authState.user) {
        userData = authState.user;
      } else if (authState.value) {
        userData = authState.value;
      } else if (authState.email) {
        userData = authState;
      }
      // If userData is a string (from localStorage), parse it
      if (typeof userData === "string") {
        try {
          userData = JSON.parse(userData);
        } catch (error) {
          console.error("🎨 Failed to parse user data:", error);
          return DEFAULT_THEME;
        }
      }

      // If we have valid user data, extract theme properties
      if (userData && typeof userData === 'object') {
        const primaryColor = userData.primaryColor || "#118eed";
        const businessType = (userData.businessType || "general").toLowerCase();
        const businessName = userData.businessName || "Business";

        // Get logo based on business type
        const logoUrl = userData.logo || BUSINESS_LOGO_MAP[businessType] || BUSINESS_LOGO_MAP.default;


        return {
          primaryColor,
          logoUrl,
          businessType,
          businessName,
          colors: {
            primary: primaryColor,
            success: "#22c55e",
            warning: "#f59e0b",
            error: "#ef4444",
            secondary: "#64748b"
          }
        };
      }

      // Fallback to default theme
      return DEFAULT_THEME;
    };

    const businessTheme = loadBusinessTheme();
    setTheme(businessTheme);
  }, [authState]);

  // Apply CSS variables when theme changes - WITH ERROR HANDLING
  useEffect(() => {
    const root = document.documentElement;

    // Safe color access with fallbacks
    const primaryColor = theme.primaryColor || DEFAULT_THEME.primaryColor;
    const colors = theme.colors || DEFAULT_COLORS;

    // Apply CSS variables safely
    root.style.setProperty("--primary-color", primaryColor);
    root.style.setProperty("--color-success", colors.success);
    root.style.setProperty("--color-warning", colors.warning);
    root.style.setProperty("--color-error", colors.error);
    root.style.setProperty("--color-secondary", colors.secondary);
  }, [theme]);

  // Safe theme value with fallbacks
  const safeTheme = useMemo(() => ({
    theme: {
      ...theme,
      colors: theme.colors || DEFAULT_COLORS
    },
    primaryColor: theme.primaryColor || DEFAULT_THEME.primaryColor,
    logoUrl: theme.logoUrl || DEFAULT_THEME.logoUrl,
    businessType: theme.businessType || DEFAULT_THEME.businessType,
    businessName: theme.businessName || DEFAULT_THEME.businessName
  }), [theme]);

  return (
    <ThemeContext.Provider value={safeTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};