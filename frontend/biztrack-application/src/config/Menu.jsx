import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import HotelIcon from "@mui/icons-material/Hotel";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';


export const MENU = [
  // Super Admin
  {
    key: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Super Admin"],
    subitems: [],
    path: "/dashboard/super-admin",
  },
  {
    key: "users",
    title: "Users",
    icon: <PeopleIcon />,
    permissions: ["Super Admin"],
    subitems: [],
    path: "/user-management",
  },
  {
    key: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    permissions: ["Super Admin"],
    subitems: [],
    path: "/reports",
  },

  // Hotel Admin
  {
    key: "hotel-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Hotel Admin"],
    subitems: [],
    path: "/dashboard/hotel-admin",
  },
  {
    key: "products",
    title: "Menu Management",
    icon: <StoreIcon />,
    permissions: ["Hotel Admin"],
    subitems: [],
    path: "/products",
  },

  {
    key: "ingredients",
    title: "Ingredient Management",
    icon: <StoreIcon />,
    permissions: ["Hotel Admin"],
    subitems: [],
    path: "/products/ingredient-management",
  },
    {
    key: "inventory",
    title: "Inventory",
    icon: <StoreIcon />,
    permissions: ["Waiter Admin"],
    subitems: [],
    path: "/inventory",
  },
  {
    key: "users",
    title: "User Management",
    icon: <PeopleIcon />,
    permissions: ["Hotel Admin"],
    subitems: [],
    path: "/staff",
  },
  {
    key: "hotel-reports",
    title: "Reports",
    icon: <BarChartIcon />,
    permissions: ["Hotel Admin"],
    subitems: [],
    path: "/reports",
  },

  // Cashier
  {
    key: "cashier-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Cashier"],
    subitems: [],
    path: "/dashboard/cashier",
  },
  {
    key: "complete-order",
    title: "Complete Order",
    icon: <ListIcon />,
    permissions: ["Cashier"],
    subitems: [],
    path: "/orders/complete",
  },
  {
    key: "cashier-reports",
    title: "Reports",
    icon: <BarChartIcon />,
    permissions: ["Cashier"],
    subitems: [],
    path: "/sales/reports",
  },

  // Waiter
  {
    key: "create-order",
    title: "Menu",
    icon: <ListIcon />,
    permissions: ["Waiter"],
    subitems: [],
    path: "/dashboard/waiter",

  },
    {
    key: "create-order",
    title: "Create Order",
    icon: <ListIcon />,
    permissions: ["Waiter"],
    subitems: [],
    path: "/dashboard/create-order",
  },
  {
    key: "waiter-reports",
    title: "Reports",
    icon: <BarChartIcon />,
    permissions: ["Waiter"],
    subitems: [],
    path: "/sales/reports",
  },

  // Kiosk Admin
  {
    key: "kiosk-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Kiosk Admin"],
    subitems: [],
    path: "/dashboard/kiosk",
  },
  {
    key: "kiosk-stock",
    title: "Stock Management",
    icon: <StoreIcon />,
    permissions: ["Kiosk Admin"],
    subitems: [],
    path: "/products/stock-management",
  },
  {
    key: "kiosk-staff",
    title: "User Management",
    icon: <PeopleIcon />,
    permissions: ["Kiosk Admin"],
    subitems: [],
    path: "/kiosk/user-management",
  },
  {
    key: "kiosk-reports",
    title: "Reports",
    icon: <BarChartIcon />,
    permissions: ["Kiosk Admin"],
    subitems: [],
    path: "/kioskreports",
  },

  // Shopkeeper
  {
    key: "shop-dashboard",
    title: "Dashboard",
    icon: <StoreIcon />,
    permissions: ["Shopkeeper"],
    subitems: [],
    path: "/dashboard/shopkeeper",
  },
  {
    key: "shop-sales",
    title: "Sales",
    icon: <ListIcon />,
    permissions: ["Shopkeeper"],
    subitems: [],
    path: "/shopkeeper/sales",
  },
    {
    key: "shop-debts",
    title: "Debts",
    icon: <AccountBalanceWalletIcon />,
    permissions: ["Shopkeeper"],
    subitems: [],
    path: "/shopkeeper/debts",
  },
  {
    key: "shop-reports",
    title: "Reports",
    icon: <BarChartIcon />,
    permissions: ["Shopkeeper"],
    subitems: [],
    path: "/shopkeeper/reports",
  },
];
