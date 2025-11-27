// src/utilities/Endpoints.js
const URLS = {
  // Base URL is prepended to all paths below
  TAG_BASE_URL: "http://localhost:3000", 

  AUTH: {
    LOGIN: "/api/auth/login",
    VERIFY_OTP: "/api/auth/verify-otp",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    VERIFY_RESET_OTP: "/api/auth/verify-reset-otp",
    RESET_PASSWORD: "/api/auth/reset-password",
    RESEND_OTP: "/api/auth/resend-otp",
    RESEND_RESET_OTP: "/api/auth/resend-reset-otp",
    TEST_EMAIL: "/api/auth/test-email"
  },

  BUSINESS: {
    CREATE_BUSINESS: "/api/business",
    GET_ALL_BUSINESSES: "/api/business",
    GET_BUSINESS_BY_ID: "/api/business/:id",
    UPDATE_BUSINESS: "/api/business/:id",
    DELETE_BUSINESS: "/api/business/:id",
    TOGGLE_BUSINESS_STATUS: "/api/business/:id/status",
  },

  USERS: {
    CREATE_USER: "/api/users",
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: "/api/users/:id",
    UPDATE_USER: "/api/users/:id",
    DELETE_USER: "/api/users/:id",
    TOGGLE_USER_STATUS: "/api/users/:id/status",
    RESET_PASSWORD: "/api/users/:id/reset-password",
    GET_USERS_BY_BUSINESS: "/api/users/business/:businessId",
    GET_USER_BY_EMAIL: "/api/users/email/:email",
    GET_USER_BY_USERNAME: "/api/users/username/:username",
  },
};

export default URLS;