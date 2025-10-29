// src/components/AppRoutes.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AppRoutes = ({ children, allowedRoles = [] }) => {
  const user = useSelector((state) => state.auth.value);
  
  console.log("🔍 AppRoutes - User from Redux:", user);
  console.log("🔍 AppRoutes - Allowed roles:", allowedRoles);
  
  // Enhanced role extraction that handles multiple formats
  const extractRole = (userObj) => {
    if (!userObj) return null;
    
    // Handle Mongoose document format
    if (userObj._doc && userObj._doc.role) {
      console.log("✅ Extracted role from _doc:", userObj._doc.role);
      return userObj._doc.role;
    }
    
    // Handle plain object - prefer normalized role, fallback to original
    if (userObj.role) {
      console.log("✅ Extracted role from plain object:", userObj.role);
      return userObj.role;
    }
    
    // Fallback to originalRole if role is missing
    if (userObj.originalRole) {
      console.log("✅ Extracted originalRole as fallback:", userObj.originalRole);
      return userObj.originalRole;
    }
    
    console.log("❌ Could not extract role from user object");
    return null;
  };
  
  // If no user object in Redux, redirect to login
  if (!user) {
    console.log("AppRoutes: No user in Redux, redirecting to login.");
    return <Navigate to="/" replace />;
  }
  
  // Extract user role
  const userRole = extractRole(user);
  
  if (!userRole) {
    console.error("AppRoutes: User object missing role. User:", user);
    return <Navigate to="/" replace />;
  }
  
  console.log("🎯 AppRoutes - User role:", userRole);
  
  // Enhanced role matching - handles both backend and frontend formats
  const isRoleAllowed = (userRole, allowedRoles) => {
    if (allowedRoles.length === 0) {
      return true; // No restrictions
    }
    
    // Direct match
    if (allowedRoles.includes(userRole)) {
      console.log("✅ Direct role match found:", userRole);
      return true;
    }
    
    // Create role mappings for flexible matching
    const roleMap = {
      // Backend format -> Frontend format
      'Super_Admin': 'biztrack-admin', // Add this line
      'SUPER_ADMIN': 'super-admin',
      'BUSINESS_ADMIN': 'business-admin', 
      'Hotel_ADMIN': 'hotel-admin',
      'Kiosk_ADMIN': 'kiosk-admin',
      'Hospital_ADMIN': 'hospital-admin',
      
      // Frontend format -> Backend format  
      'biztrack-admin': 'Super_Admin', // Add this line
      'super-admin': 'SUPER_ADMIN',
      'business-admin': 'BUSINESS_ADMIN',
      'hotel-admin': 'Hotel_ADMIN', 
      'kiosk-admin': 'Kiosk_ADMIN',
      'hospital-admin': 'Hospital_ADMIN',
    };
    
    // Check if mapped version of user role is in allowed roles
    const mappedRole = roleMap[userRole];
    if (mappedRole && allowedRoles.includes(mappedRole)) {
      console.log("✅ Mapped role match found:", userRole, "->", mappedRole);
      return true;
    }
    
    // Check if any allowed role maps to user role
    for (const allowedRole of allowedRoles) {
      if (roleMap[allowedRole] === userRole) {
        console.log("✅ Reverse mapped role match found:", allowedRole, "->", userRole);
        return true;
      }
    }
    
    console.log("❌ No role match found for:", userRole, "in allowed:", allowedRoles);
    return false;
  };
  
  // Check if the user's role is allowed
  const isAllowed = isRoleAllowed(userRole, allowedRoles);
  
  console.log("✅ AppRoutes - Access allowed:", isAllowed);
  
  if (!isAllowed) {
    console.log("❌ AppRoutes - Role not allowed. User has:", userRole, "Allowed:", allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default AppRoutes;