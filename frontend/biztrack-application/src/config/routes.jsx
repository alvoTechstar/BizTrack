import React from "react";
import Header from "../components/header";
import Login from "../views/sign-in/Login";
import Dashboard from "../views/main-app/dashboard";
import SalesPage from "../views/main-app/sales";
import ReportsPage from "../views/main-app/reports";
import StockManagementPage from "../views/main-app/products/stock-management";
import IngredientsManagementPage from "../views/main-app/products/stock-management/ingredient-management";
import SuperAdminDashboard from "../views/main-app/dashboard/super-admin";
import HotelAdminDashboard from "../views/main-app/dashboard/hotel/hoteldashboard";
import MenuManagement from "../views/main-app/products/menumanagement";
import StaffManagement from "../views/main-app/staff";
import InventoryPage from "../views/main-app/products/inventory";
import HotelOrders from "../views/main-app/sales/hotel-orders";
import UserManagement from "../views/main-app/User-Management";
import CashierDashboard from "../views/main-app/dashboard/hotel/casheardashboard";
import CashierOrders from "../views/main-app/dashboard/hotel/cashierorders";
import App from "../views/main-app/modal";

// Define routes with role-based access control
export const routes = [
  {
    path: "/",
    element: <Login />,
    isprivate: false,
    allowedRoles: [], // Public route, no role restrictions
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    isprivate: true,
    allowedRoles: ["Super Admin", "Hotel Admin", "Kiosk Admin"], // Accessible to Super Admin, Hotel Admin, and Kiosk Admin
  },
  {
    path: "sales",
    element: <SalesPage />,
    isprivate: true,
    allowedRoles: ["Super Admin", "Hotel Admin", "Kiosk Admin"],
  },
  {
    path: "reports",
    element: <ReportsPage />,
    isprivate: true,
    allowedRoles: ["Super Admin", "Admin", "Auditor"], // Reports can be accessed by Super Admin, Admin, and Auditor
  },
  {
    path: "products/stock-management",
    element: <StockManagementPage />,
    isprivate: true,
    allowedRoles: ["Super Admin", "Admin", "Kiosk Admin", "Hotel Admin"],
  },
  {
    path: "products/ingredient-management",
    element: <IngredientsManagementPage />,
    isprivate: true,
    allowedRoles: ["Super Admin", "Admin"],
  },
  {
    path: "dashboard/super-admin",
    element: <SuperAdminDashboard />,
    isprivate: true,
    allowedRoles: ["Super Admin"],
  },
  {
    path: "dashboard/hotel-admin",
    element: <HotelAdminDashboard />,
    isprivate: true,
    allowedRoles: ["Hotel Admin"],
  },
  {
    path: "products",
    element: <MenuManagement />,
    isprivate: true,
    allowedRoles: ["Super Admin", "Hotel Admin", "Kiosk Admin"],
  },
  {
    path: "staff",
    element: <StaffManagement />,
    isprivate: true,
    allowedRoles: ["Super Admin", "Hotel Admin", "Kiosk Admin"],
  },
  {
    path: "inventory",
    element: <HotelOrders />,
    isprivate: true,
    allowedRoles: ["Hotel Admin", "Kiosk Admin"],
  },
  {
    path: "user-management",
    element: <UserManagement />,
    isprivate: true,
    allowedRoles: ["Super Admin"],
  },
  {
    path: "cashier-orders",
    element: <CashierOrders />,
    isprivate: true,
    allowedRoles: ["Hotel Admin", "Cashier"],
  },
  {
    path: "modal",
    element: <App />,
    isprivate: false,
    allowedRoles: [],
  },
];
