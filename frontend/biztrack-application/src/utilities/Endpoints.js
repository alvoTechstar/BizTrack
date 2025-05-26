const URLS = {
  TAG_BASE_URL: "http://transfer-advise-service.test.kube.iswke",
  // TAG_BASE_URL: "http://localhost:8080",
  TAG_BASE_PATH: "/api/v1",

  // Authentication
  TAG_API_AUTH: "/authentication",
  TAG_API_SIGN_UP: "/sign-up",
  TAG_API_VALIDATE_OTP: "/validate-otp",
  TAG_API_PASSWORD_RESET: "/forgot-password",
  TAG_API_PASSWORD_SET: "/set-secret",
  TAG_API_VALIDATE_TOKEN: "/auth/validate",
  TAG_API_VALIDATE_TOKEN_ME: "/auth/validate_me",
  TAG_API_LOGOUT: "/app/users/log-out",
  TAG_API_STATUS: "/keys",

  //Users
  TAG_API_USERS: "/app/users",
  TAG_API_USER_STATUS: "/app/users/change-status",
  TAG_API_PROFILE: "/app/user-profile",
  TAG_API_CHANGE_SECRET: "/app/user-profile/change-secrete",
  TAG_ROLE_MATRIX: "/app/users/role-matrix",

  // Institutions
  TAG_API_INSTITUTIONS: "/app/institutions",
  TAG_API_INSTITUTION_STATUS: "/app/institutions/change-status",
  TAG_API_INSTITUTION_BRANCHES: "/app/institutions/branches",

  //Branches
  TAG_API_BRANCHES: "/app/branches",
  TAG_API_BRANCH_STATUS: "/app/branches/change-status",

  //Inbound Remittance
  //Cash Pickup
  TAG_API_TRANSACTIONS_INBOUND_CASHPICKUP: "/app/ria/cash/report",
  TAG_API_CASH_PICKUP_SEARCH: "/app/ria/cash",
  TAG_API_CASH_PICKUP_APPROVAL: "/app/ria/cash/approval",
  TAG_API_CASH_PAYMENT: "/app/ria/cash/payment",
  TAG_API_CASH_APPROVE: "/app/ria/cash/approval",

  //Bank Deposit
  TAG_API_TRANSACTIONS_INBOUND_BANKDEPOSIT: "/app/ria/download/report",

  //OutboundRemittance
  //Customer and Beneficiary
  TAG_RIA_CUSTOMER: "/ria/send-money/customer",
  TAG_RIA_BENEFICIARY: "/ria/send-money/customer/beneficiary",

  //CashPickup
  TAG_RIA: "/ria/send-money",
  TAG_RIA_ORDERS: "/send-orders/orders",
  TAG_RIA_ALLOWED_COUNTRIES: "/master-data/countries",
  TAG_RIA_ALLOWED_STATES: "/master-data/states",
  TAG_RIA_ALLOWED_CITIES: "/master-data/cities",
  TAG_RIA_CURRENCIES: "/master-data/currencies",
  TAG_RIA_COUNTRY: "/network/get-country",
  TAG_RIA_DELIVERY_METHODS: "/delivery-methods",
  TAG_RIA_CASH_PICKUP_PARTNERS: "/network/get-payout-partners?deliveryId=1&",
  TAG_RIA_BANK_DEPOSIT_PARTNERS: "/network/get-banks",
  TAG_RIA_RATES: "/send-orders/amount-requirements",
  TAG_RIA_ORDER_DRAFT: "/send-orders/transaction/create-draft-order",
  TAG_RIA_ORDER: "/send-orders/order/send",
  TAG_RIA_ORDER_APPROVE: "/send-orders/order/approve",
  TAG_RIA_REASONS: "/send-orders/sendorder-transaction-values",

  //Countries
  TAG_API_COUNTRIES: "/app/countries",

  //Audit
  TAG_API_SYSTEM_AUDIT: "/app/audit-trail",
  TAG_API_TRANSACTION_AUDIT: "/app/audit-trail/transactions/POST_RIA",
};
export default URLS;
