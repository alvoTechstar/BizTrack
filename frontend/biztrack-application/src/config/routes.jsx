import React from "react";
import Login from "../views/sign-in/Login";
import Dashboard from "../views/main-app/dashboard/kiosk/kioskadmin";
import SalesPage from "../views/main-app/sales";
import ReportsPage from "../views/main-app/reports/hotel/admin";
import StockManagementPage from "../views/main-app/products/stock-management";
import SuperAdminDashboard from "../views/main-app/dashboard/super-admin/index";
import HotelAdminDashboard from "../views/main-app/dashboard/hotel/admin/index";
import CashierDashboard from "../views/main-app/dashboard/hotel/cashier/index";
import MenuManagement from "../views/main-app/products/menumanagement";
import StaffManagement from "../views/main-app/User-Management/hotel/index";
import InventoryPage from "../views/main-app/products/inventory";
import HotelOrders from "../views/main-app/sales/hotel-orders";
import App from "../views/main-app/modal";
import CreateOrder from "../views/main-app/sales/CreateOrder";
import CompleteOrder from "../views/main-app/sales/CompleteOrder";
import ProfilePage from "../views/main-app/profile/ProfilePage";
import IngredientsManagementPage from "../views/main-app/products/ingredient-management";
import ForgotPassword from "../views/sign-in/ForgotPassword";
import UserManagement from "../views/main-app/User-Management/super-admin";
import KioskStaffManagement from "../views/main-app/User-Management/kiosk";
import DebtManagement from "../views/main-app/debtmanagement/DebtManagement";
import ShopkeeperReportsPage from "../views/main-app/reports/kiosk/shopkeeper/ShopkeeperReportsPage";
import KioskAdminReportsPage from "../views/main-app/reports/kiosk/kioskadmin/KioskAdminReportsPage";

export const routes = [
  // Public Routes
  {
    path: "/",
    element: <Login />,
    isPrivate: false,
    allowedRoles: [],
  },
  {
    path: "/reset-password",
    element: <ForgotPassword />,
    isPrivate: false,
    allowedRoles: [],
  },
  {
    path: "/modal",
    element: <App />,
    isPrivate: false,
    allowedRoles: [],
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    isPrivate: false,
    allowedRoles: [],
  },

  // Super Admin (Biztrack Admin)
  {
    path: "/dashboard/super-admin",
    element: <SuperAdminDashboard />,
    isPrivate: true,
    allowedRoles: ["biztrack-admin"],
  },
  {
    path: "/user-management",
    element: <UserManagement />,
    isPrivate: true,
    allowedRoles: ["biztrack-admin"],
  },

  // Hotel Admin
  {
    path: "/dashboard/hotel-admin",
    element: <HotelAdminDashboard />,
    isPrivate: true,
    allowedRoles: ["hotel-admin"],
  },
  {
    path: "/products",
    element: <MenuManagement />,
    isPrivate: true,
    allowedRoles: ["hotel-admin", "kiosk-admin"],
  },

  {
    path: "/products/ingredient-management",
    element: <IngredientsManagementPage />,
    isPrivate: true,
    allowedRoles: ["hotel-admin"],
  },
  {
    path: "/staff",
    element: <StaffManagement />,
    isPrivate: true,
    allowedRoles: ["hotel-admin"],
  },
  {
    path: "/orders/hotel",
    element: <HotelOrders />,
    isPrivate: true,
    allowedRoles: ["hotel-admin"],
  },
  {
    path: "/reports",
    element: <ReportsPage />,
    isPrivate: true,
    allowedRoles: [
      "hotel-admin",
      "kiosk-admin",
      "biztrack-admin",
      "hotel-cashier",
    ],
  },

  // Cashier
  {
    path: "/dashboard/cashier",
    element: <CashierDashboard />,
    isPrivate: true,
    allowedRoles: ["hotel-cashier"],
  },
  {
    path: "/orders/complete",
    element: <CompleteOrder />,
    isPrivate: true,
    allowedRoles: ["hotel-cashier"],
  },

  // Waiter
  {
    path: "/dashboard/waiter",
    element: <CreateOrder />,
    isPrivate: true,
    allowedRoles: ["hotel-waiter"],
  },
    {
    path: "/dashboard/create-order",
    element: <CreateOrder />,
    isPrivate: true,
    allowedRoles: ["hotel-waiter"],
  },

  // Kiosk Admin
  {
    path: "/dashboard/kiosk",
    element: <Dashboard />,
    isPrivate: true,
    allowedRoles: ["kiosk-admin"],
  },
  {
    path: "/inventory",
    element: <InventoryPage />,
    isPrivate: true,
    allowedRoles: ["kiosk-admin"],
  },
  {
    path: "/products/stock-management",
    element: <StockManagementPage />,
    isPrivate: true,
    allowedRoles: ["kiosk-admin"],
  },
  {
    path: "/kiosk/user-management",
    element: <KioskStaffManagement />,
    isPrivate: true,
    allowedRoles: ["kiosk-admin"],
  },
  {
    path: "/kioskreports",
    element: <KioskAdminReportsPage />,
    isPrivate: true,
    allowedRoles: ["kiosk-admin"],
  },

  // Shopkeeper
  {
    path: "/dashboard/shopkeeper",
    element: <Dashboard />,
    isPrivate: true,
    allowedRoles: ["kiosk-shopkeeper"],
  },
  {
    path: "/shopkeeper/sales",
    element: <SalesPage />,
    isPrivate: true,
    allowedRoles: ["kiosk-shopkeeper"],
  },
  {
    path: "/shopkeeper/debts",
    element: <DebtManagement />,
    isPrivate: true,
    allowedRoles: ["kiosk-shopkeeper"],
  },
  {
    path: "/shopkeeper/reports",
    element: <ShopkeeperReportsPage />,
    isPrivate: true,
    allowedRoles: ["kiosk-shopkeeper"],
  },

  // Fallback route
  {
    path: "*",
    element: <div>404 Not Found</div>,
    isPrivate: false,
    allowedRoles: [],
  },
];
