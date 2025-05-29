// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to read from Redux store
import { mockBusinesses } from '../../config/Mockusers'; 
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    logoUrl: '/default-logo.png', // Default logo (Biztrack default)
    primaryColor: '#007bff',     // Default primary color (Biztrack default)
  });
  const [loadingTheme, setLoadingTheme] = useState(true);

  // Get the current authenticated user from Redux state
  // This will re-render ThemeProvider whenever the Redux auth state changes
  const authUser = useSelector((state) => state.auth.value);

  // Helper function to get theme based on user data
  const getThemeForUser = (user) => {
    // Handle cases where user might be null or undefined
    if (!user) {
      console.log("No user in Redux, applying default Biztrack theme.");
      return { logoUrl: '/logos/biztrack-default-logo.png', primaryColor: '#6f42c1' };
    }

    // Ensure the user object is parsed if it came from a cookie as a string
    let parsedUser = user;
    if (typeof user === 'string') {
        try {
            parsedUser = JSON.parse(user);
        } catch (e) {
            console.error("Error parsing user from Redux state:", e);
            return { logoUrl: '/logos/biztrack-default-logo.png', primaryColor: '#6f42c1' };
        }
    }

    // Check if the user has an associatedBusinessId
    const businessId = parsedUser.associatedBusinessId;
    if (!businessId) {
        console.warn(`User ${parsedUser.email} has no associatedBusinessId, applying default Biztrack theme.`);
        return { logoUrl: '/logos/biztrack-default-logo.png', primaryColor: '#6f42c1' };
    }

    // Find the associated business from mock data
    const associatedBusiness = mockBusinesses.find(
      (biz) => biz.id === businessId
    );

    if (associatedBusiness) {
      return {
        logoUrl: associatedBusiness.logoUrl,
        primaryColor: associatedBusiness.primaryColor,
      };
    } else {
      console.warn(`No mock business found for ID: ${businessId}. Using default Biztrack theme.`);
      return { logoUrl: '/logos/biztrack-default-logo.png', primaryColor: '#6f42c1' };
    }
  };

  // Effect to update theme whenever the Redux authUser changes
  useEffect(() => {
    // console.log("Auth user changed in ThemeProvider:", authUser); // For debugging
    setTheme(getThemeForUser(authUser));
    setLoadingTheme(false); // Theme is loaded/determined once authUser is available
  }, [authUser]); // Dependency on authUser from Redux

  // Effect to apply theme to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    // document.documentElement.style.setProperty('--primary-color-rgb', /* calculate RGB if needed */);
  }, [theme.primaryColor]);

  // Provide the theme value to context consumers
  const contextValue = useMemo(() => ({
    theme,
  }), [theme]);

  if (loadingTheme) {
    // You might want a better loading indicator here
    return <div>Loading application theme...</div>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access theme properties
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

// We don't need a `useAuth` hook here for `mockLogin`/`mockLogout`
// because your `Login.js` already dispatches to Redux.
// The `ThemeContext` simply listens to Redux.