export const ROLES = [
  {
    role: "SUPER_ADMIN",
    options: [
      { value: "SUPER_ADMIN", label: "Super Admin" },
      { value: "ADMIN", label: "Admin" },
      { value: "CASHIER", label: "Cashier" },
      { value: "SHOPKEEPER", label: "Shopkeeper" },
      { value: "WAITER", label: "Waiter" },
    ],
    optionsCreate: [
      { value: "SUPER_ADMIN", label: "Super Admin" },
      { value: "ADMIN", label: "Admin" },
    ],
  },
  {
    role: "ADMIN",
    options: [
      { value: "ADMIN", label: "Admin" },
      { value: "CASHIER", label: "Cashier" },
      { value: "SHOPKEEPER", label: "Shopkeeper" },
      { value: "WAITER", label: "Waiter" },
    ],
    optionsCreate: [
      { value: "ADMIN", label: "Admin" },
      { value: "CASHIER", label: "Cashier" },
      { value: "SHOPKEEPER", label: "Shopkeeper" },
    ],
  },
  {
    role: "CASHIER",
    options: [
      { value: "CASHIER", label: "Cashier" },
      { value: "SHOPKEEPER", label: "Shopkeeper" },
    ],
    optionsCreate: [
      { value: "CASHIER", label: "Cashier" },
      { value: "SHOPKEEPER", label: "Shopkeeper" },
    ],
  },
  {
    role: "SHOPKEEPER",
    options: [
      { value: "SHOPKEEPER", label: "Shopkeeper" },
      { value: "CASHIER", label: "Cashier" },
    ],
    optionsCreate: [
      { value: "SHOPKEEPER", label: "Shopkeeper" },
    ],
  },
  {
    role: "WAITER",
    options: [
      { value: "WAITER", label: "Waiter" },
      { value: "CASHIER", label: "Cashier" },
    ],
    optionsCreate: [
      { value: "WAITER", label: "Waiter" },
    ],
  },
  {
    role: "ALL",
    options: [
      { value: "SUPER_ADMIN", label: "Super Admin" },
      { value: "ADMIN", label: "Admin" },
      { value: "CASHIER", label: "Cashier" },
      { value: "SHOPKEEPER", label: "Shopkeeper" },
      { value: "WAITER", label: "Waiter" },
    ],
  },
];
