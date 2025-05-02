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


export const routes = [
    {
        path: "*",
        element: <Header/>,
        isprivate: false,
    },
    // {
    //     path: "/",
    //     element: <Login/>,
    //     isprivate: false,
    // },
    {
        path: "/",
        element: <Dashboard/>,
        isprivate: false,
    },
    {
        path: "sales",
        element: <SalesPage/>,
        isprivate: false,
    },
    {
        path: "reports",
        element: <ReportsPage/>,
        isprivate: false,
    },
    {
        path: "products/stock-management",
        element: <StockManagementPage/>,
        isprivate: false,
    },
    {
        path: "products/ingredient-management",
        element: <IngredientsManagementPage/>,
        isprivate: false,
    },
 
    // {
    //     path: "dashboard",
    //     element: <SuperAdminDashboard/>,
    //     isprivate: false,
    // },
    // {
    //     path: "dashboard",
    //     element: <HotelAdminDashboard/>,
    //     isprivate: false,
    // },
    {
        path: "dashboard",
        element: <CashierDashboard/>,
        isprivate: false,
    },
    {
        path: "products",
        element: <MenuManagement/>,
        isprivate: false,
    },
    {
        path: "staff",
        element: <StaffManagement/>,
        isprivate: false,
    },
    // {
    //     path: "inventory",
    //     element: <InventoryPage/>,
    //     isprivate: false,
    // },
    {
        path: "inventory",
        element: <HotelOrders/>,
        isprivate: false,
    },
    {
        path: "user-management",
        element: <UserManagement/>,
        isprivate: false,
    },
    {
        path: "cashier-orders",
        element: <CashierOrders/>,
        isprivate: false,
    },
    {
        path: "modal",
        element: <App/>,
        isprivate: false,
    },
 
];