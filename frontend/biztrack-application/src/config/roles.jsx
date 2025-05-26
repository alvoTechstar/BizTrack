export const ROLES = [
  {
    role: "Biztrack_ADMIN",
    options: [
      { value: "Biztrack_ADMIN", label: "Super Admin" },
      { value: "Hotel_Admin", label: "Hotel Admin" },
      { value: "Hotel_Cashier", label: "Cashier" },
      { value: "Kiosk_Admin", label: "Kiosk Admin" },
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
      { value: "Hotel_Waiter", label: "Waiter" },
    ],
    optionsCreate: [
      { value: "Biztrack_ADMIN", label: "Super Admin" },
      { value: "Hotel_Admin", label: "Hotel Admin" },
    ],
  },
  {
    role: "Hotel_Admin",
    options: [
      { value: "Hotel_Admin", label: "Hotel Admin" },
      { value: "Hotel_Cashier", label: "Cashier" },
      { value: "Kiosk_Admin", label: "Kiosk Admin" },
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
      { value: "Hotel_Waiter", label: "Waiter" },
    ],
    optionsCreate: [
      { value: "Hotel_Admin", label: "Hotel Admin" },
      { value: "Hotel_Cashier", label: "Cashier" },
      { value: "Hotel_Waiter", label: "Waiter" },
    ],
  },
  {
    role: "Hotel_Cashier",
    options: [
      { value: "Hotel_Cashier", label: "Cashier" },
      { value: "Kiosk_Admin", label: "Kiosk Admin" },
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
      { value: "Hotel_Admin", label: "Hotel Admin" },
    ],
    optionsCreate: [
      { value: "Hotel_Cashier", label: "Cashier" },
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
    ],
  },
  {
    role: "Kiosk_Admin",
    options: [
      { value: "Kiosk_Admin", label: "Kiosk Admin" },
      { value: "Hotel_Cashier", label: "Cashier" },
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
    ],
    optionsCreate: [
      { value: "Kiosk_Admin", label: "Kiosk Admin" },
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
    ],
  },
  {
    role: "Kiosk_Shopkeeper",
    options: [
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
      { value: "Hotel_Cashier", label: "Cashier" },
    ],
    optionsCreate: [
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
    ],
  },
  {
    role: "Hotel_Waiter",
    options: [
      { value: "Hotel_Waiter", label: "Waiter" },
      { value: "Hotel_Cashier", label: "Cashier" },
      { value: "Hotel_Admin", label: "Hotel Admin" },
    ],
    optionsCreate: [
      { value: "Hotel_Waiter", label: "Waiter" },
    ],
  },
  {
    role: "ALL",
    options: [
      { value: "Biztrack_ADMIN", label: "Super Admin" },
      { value: "Hotel_Admin", label: "Hotel Admin" },
      { value: "Hotel_Cashier", label: "Cashier" },
      { value: "Kiosk_Admin", label: "Kiosk Admin" },
      { value: "Kiosk_Shopkeeper", label: "Shopkeeper" },
      { value: "Hotel_Waiter", label: "Waiter" },
    ],
  },
];
