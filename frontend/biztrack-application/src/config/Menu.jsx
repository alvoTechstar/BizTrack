import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InventoryIcon from '@mui/icons-material/Inventory';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';



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
    key: "staff-payment",
    title: "Staff Payments",
    icon: <PeopleIcon />,
    permissions: ["Hotel Admin"],
    subitems: [],
    path: "/staffpayment",
  },
    {
    key: "expenses",
    title: "Expenses",
    icon: <AccountBalanceWalletIcon />,
    permissions: ["Hotel Admin"],
    subitems: [],
    path: "/hotel/expenses",
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
    // Hospital Admin
  {
    key: "hospital-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Hospital Admin"],
    subitems: [],
    path: "/dashboard/hospital-admin",
  },
  {
    key: "hospital-patients",
    title: "Patients",
    icon: <LocalHospitalIcon />,
    permissions: ["Hospital Admin"],
    subitems: [],
    path: "/hospital/patients",
  },
  {
    key: "hospital-staff",
    title: "Staff Management",
    icon: <PeopleIcon />,
    permissions: ["Hospital Admin"],
    subitems: [],
    path: "/hospital/staff",
  },
    {
    key: "pharmacy-stock",
    title: "Pharmacy Stock",
    icon: <LocalPharmacyIcon />,
    permissions: ["Hospital Admin"],
    subitems: [],
    path: "/pharmacy/stock",
  },
  {
    key: "hospital-reports",
    title: "Reports",
    icon: <BarChartIcon />,
    permissions: ["Hospital Admin"],
    subitems: [],
    path: "/hospital/admin-reports",
  },

  // Receptionist
  {
    key: "receptionist-dashboard",
    title: "Recepition Queue",
    icon: <DashboardIcon />,
    permissions: ["Receptionist"],
    subitems: [],
    path: "/patient/queue",
  },
  {
    key: "receptionist-patients",
    title: "Patient Records",
    icon: <LocalHospitalIcon />,
    permissions: ["Receptionist"],
    subitems: [],
    path: "/receptionist/patients",
  },
  {
    key: "receptionist-appointments",
    title: "Appointments",
    icon: <ListIcon />,
    permissions: ["Receptionist"],
    subitems: [],
    path: "/receptionist/appointments",
  },

  // Doctor
  {
    key: "doctor-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Doctor"],
    subitems: [],
    path: "/dashboard/doctor",
  },
  {
    key: "doctor-patients",
    title: "My Patients",
    icon: <LocalHospitalIcon />,
    permissions: ["Doctor"],
    subitems: [],
    path: "/doctor/patients",
  },
  {
    key: "doctor-appointments",
    title: "Appointments",
    icon: <ListIcon />,
    permissions: ["Doctor"],
    subitems: [],
    path: "/doctor/appointments",
  },

  // Nurse
  {
    key: "nurse-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Nurse"],
    subitems: [],
    path: "/dashboard/nurse",
  },
  {
    key: "nurse-patients",
    title: "Patient Care",
    icon: <LocalHospitalIcon />,
    permissions: ["Nurse"],
    subitems: [],
    path: "/nurse/patients",
  },
  {
    key: "nurse-vitals",
    title: "Vitals",
    icon: <InventoryIcon />,
    permissions: ["Nurse"],
    subitems: [],
    path: "/nurse/vitals",
  },

  // Pharmacist
  {
    key: "pharmacist-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Pharmacist"],
    subitems: [],
    path: "/dashboard/pharmacist",
  },
  {
    key: "pharmacist-inventory",
    title: "Inventory",
    icon: <MedicationIcon />,
    permissions: ["Pharmacist"],
    subitems: [],
    path: "/pharmacist/inventory",
  },
  {
    key: "pharmacist-dispense",
    title: "Dispense Drugs",
    icon: <StoreIcon />,
    permissions: ["Pharmacist"],
    subitems: [],
    path: "/pharmacist/dispense",
  },

  // Lab Technician
  {
    key: "labtech-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    permissions: ["Lab Technician"],
    subitems: [],
    path: "/dashboard/labtech",
  },
  {
    key: "labtech-tests",
    title: "Tests",
    icon: <ScienceIcon />,
    permissions: ["Lab Technician"],
    subitems: [],
    path: "/labtech/tests",
  },
  {
    key: "labtech-results",
    title: "Results",
    icon: <BarChartIcon />,
    permissions: ["Lab Technician"],
    subitems: [],
    path: "/labtech/results",
  },

];
