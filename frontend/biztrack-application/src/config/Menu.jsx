import DashboardIcon from "@mui/icons-material/Dashboard";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupIcon from "@mui/icons-material/Group";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";

export const MENU = [
  // Common
  {
    key: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    roles: ["admin", "shopkeeper", "cashier", "waiter"],
    icon: <DashboardIcon />,
    subitems: [],
  },

  // Kiosk-specific (shopkeeper)
  {
    key: "products",
    title: "Products",
    path: "/products",
    roles: ["admin", "shopkeeper"],
    icon: <InventoryIcon />,
    subitems: [],
  },
  {
    key: "sales",
    title: "Sales",
    path: "/sales",
    roles: ["admin", "shopkeeper"],
    icon: <PointOfSaleIcon />,
    subitems: [],
  },

  // Hotel-specific (waiter & cashier)
  {
    key: "create-order",
    title: "Create Order",
    path: "/orders/create",
    roles: ["waiter"],
    icon: <AddShoppingCartIcon />,
    subitems: [],
  },
  {
    key: "complete-order",
    title: "Complete Orders",
    path: "/orders/complete",
    roles: ["cashier"],
    icon: <CheckCircleIcon />,
    subitems: [],
  },

  // Reports (common for admin/cashier)
  {
    key: "reports",
    title: "Reports",
    path: "/reports",
    roles: ["admin", "cashier"],
    icon: <ReportIcon />,
    subitems: [],
  },

  // User management (admin only)
  {
    key: "users",
    title: "User Management",
    path: "/users",
    roles: ["admin"],
    icon: <GroupIcon />,
    subitems: [],
  }
];
