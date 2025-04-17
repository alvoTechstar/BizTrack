export const ROLE_MATRIX = [
  {
    role: "SUPER_ADMIN",
    permissions: [
      "Access All Businesses",
      "Manage Roles",
      "Create Business Admins",
      "View All Reports",
      "Login",
    ],
  },

  // HOTEL
  {
    role: "HOTEL_ADMIN",
    permissions: [
      "Login",
      "View Dashboard",
      "Manage Menu",
      "Manage Staff",
      "View Sales",
      "Restock Inventory",
      "Manage Orders",
      "Create Hotel Users",
    ],
  },
  {
    role: "HOTEL_CASHIER",
    permissions: [
      "Login",
      "Process Payments",
      "View Orders",
      "View Dashboard",
    ],
  },
  {
    role: "HOTEL_WAITER",
    permissions: [
      "Login",
      "Create Orders",
      "View Menu",
      "Track Order Status",
    ],
  },

  // KIOSK
  {
    role: "KIOSK_ADMIN",
    permissions: [
      "Login",
      "View Dashboard",
      "Manage Products",
      "Manage Staff",
      "Restock",
      "View Reports",
      "Create Kiosk Users",
    ],
  },
  {
    role: "KIOSK_CASHIER",
    permissions: [
      "Login",
      "Sell Products",
      "View Products",
      "Daily Sales Report",
    ],
  },

  // KINYOZI
  {
    role: "KINYOZI_ADMIN",
    permissions: [
      "Login",
      "Manage Services",
      "Manage Staff",
      "View Appointments",
      "View Reports",
      "Create Kinyozi Users",
    ],
  },
  {
    role: "KINYOZI_OPERATOR",
    permissions: [
      "Login",
      "Start Service",
      "View Schedule",
      "Complete Service",
    ],
  },

  // CARWASH
  {
    role: "CARWASH_ADMIN",
    permissions: [
      "Login",
      "View Dashboard",
      "Register Clients",
      "Manage Services",
      "View Reports",
      "Create Carwash Users",
    ],
  },
  {
    role: "CARWASH_OPERATOR",
    permissions: [
      "Login",
      "Mark Car as Cleaned",
      "View Jobs",
    ],
  },

  // PHARMACY
  {
    role: "PHARMACY_ADMIN",
    permissions: [
      "Login",
      "Manage Inventory",
      "View Sales",
      "Register Prescriptions",
      "Manage Staff",
      "Create Pharmacy Users",
    ],
  },
  {
    role: "PHARMACY_CASHIER",
    permissions: [
      "Login",
      "Sell Medication",
      "Check Stock",
      "View Sales Today",
    ],
  },
];
