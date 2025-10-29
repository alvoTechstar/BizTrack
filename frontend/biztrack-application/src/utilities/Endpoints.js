const URLS = {
  // TAG_BASE_URL: "http://transfer-advise-service.test.kube.iswke",
  TAG_BASE_URL: "http://localhost:3000/api",
  // TAG_BASE_PATH: "/api",
    
  // Authentication Endpoints
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_OTP: "/auth/verify-reset-otp",
    RESET_PASSWORD: "/auth/reset-password",
    RESEND_OTP: "/auth/resend-otp",
    RESEND_RESET_OTP: "/auth/resend-reset-otp",
    TEST_EMAIL: "/auth/test-email" // Optional: for testing email configuration
  },

  // User Management Endpoints
  USER_MANAGEMENT: {
    // Business endpoints
    BUSINESSES: "/businesses",
    BUSINESS_BY_ID: "/businesses/:id",
    BUSINESS_SETUP: "/business-setup",
    BUSINESS_ADMINS: "/business/:businessId/admins",
    
    // Admin endpoints
    ADMINS: "/admins",
    
    // User endpoints (if you have them)
    USERS: "/users",
    USER_BY_ID: "/users/:id"
  },

  // Business Management Endpoints (Complete from your BusinessRoutes)
  BUSINESS: {
    // Main business endpoints
    CREATE_BUSINESS: "/businesses",
    GET_ALL_BUSINESSES: "/businesses",
    GET_BUSINESS_BY_ID: "/businesses/:id",
    UPDATE_BUSINESS: "/businesses/:id",
    DELETE_BUSINESS: "/businesses/:id", // Actually archives by setting to inactive
    TOGGLE_BUSINESS_STATUS: "/businesses/:id/status",
    
    // Utility endpoints
    GET_BUSINESS_BY_REGISTRATION: "/businesses/registration/:registrationNumber",
    GET_BUSINESS_BY_NAME: "/businesses/name/:name",
    
    // Test endpoints
    TEST_PUBLIC: "/businesses/test/public"
  },

  // User Management Endpoints (if you have user routes)
  USERS: {
    CREATE_USER: "/users",
    GET_ALL_USERS: "/users",
    GET_USER_BY_ID: "/users/:id",
    GET_USER_BY_EMAIL: "/users/email/:email",
    GET_USER_BY_USERNAME: "/users/username/:username",
    UPDATE_USER: "/users/:id",
    UPDATE_USER_PASSWORD: "/users/:id/password",
    DELETE_USER: "/users/:id",
    TOGGLE_USER_STATUS: "/users/:id/status",
    
    // Business-specific user endpoints
    GET_USERS_BY_BUSINESS: "/users/business/:businessId",
    GET_USER_BY_BUSINESS_ID: "/users/business/:businessId/user"
  },

  // Combined endpoints for easy access (Legacy - consider using the categorized ones above)
  ENDPOINTS: {
    // Authentication
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_OTP: "/auth/verify-reset-otp",
    RESET_PASSWORD: "/auth/reset-password",
    RESEND_OTP: "/auth/resend-otp",
    RESEND_RESET_OTP: "/auth/resend-reset-otp",
    
    // Business Management
    CREATE_BUSINESS: "/businesses",
    GET_BUSINESSES: "/businesses",
    GET_BUSINESS: "/businesses/:id",
    UPDATE_BUSINESS: "/businesses/:id",
    DELETE_BUSINESS: "/businesses/:id",
    TOGGLE_BUSINESS_STATUS: "/businesses/:id/status",
    
    // User Management
    CREATE_USER: "/users",
    GET_USERS: "/users",
    GET_USER: "/users/:id",
    UPDATE_USER: "/users/:id",
    DELETE_USER: "/users/:id",
    
    // Admin Management
    CREATE_ADMIN: "/admins",
    GET_ADMINS: "/admins"
  },

};

export default URLS;