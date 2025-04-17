export const MENU = {
    SUPER_ADMIN: [
      { title: "Dashboard", path: "/super-dashboard", icon: "📊" },
      { title: "Manage Businesses", path: "/manage", icon: "🏢" },
      { title: "Users", path: "/users", icon: "👤" },
      { title: "Reports", path: "/reports", icon: "📈" },
    ],
  
    // Hotel Roles
    HOTEL_ADMIN: [
      { title: "Dashboard", path: "/hotel/dashboard", icon: "🏨" },
      { title: "Orders", path: "/hotel/orders", icon: "🧾" },
      { title: "Menu", path: "/hotel/menu", icon: "🍽️" },
      { title: "Inventory", path: "/hotel/inventory", icon: "📦" },
      { title: "Staff", path: "/hotel/staff", icon: "👨‍🍳" },
      { title: "Sales", path: "/hotel/sales", icon: "💰" },
    ],
    HOTEL_CASHIER: [
      { title: "Dashboard", path: "/hotel/dashboard", icon: "📊" },
      { title: "Payments", path: "/hotel/payments", icon: "💳" },
      { title: "Orders", path: "/hotel/orders", icon: "🧾" },
    ],
    HOTEL_WAITER: [
      { title: "Create Order", path: "/hotel/create-order", icon: "📝" },
      { title: "Menu", path: "/hotel/menu", icon: "🍽️" },
      { title: "Track Orders", path: "/hotel/track-orders", icon: "📦" },
    ],
  
    // Kiosk Roles
    KIOSK_ADMIN: [
      { title: "Dashboard", path: "/kiosk/dashboard", icon: "🏪" },
      { title: "Products", path: "/kiosk/products", icon: "📦" },
      { title: "Staff", path: "/kiosk/staff", icon: "👥" },
      { title: "Restock", path: "/kiosk/restock", icon: "🔄" },
      { title: "Reports", path: "/kiosk/reports", icon: "📊" },
    ],
    KIOSK_CASHIER: [
      { title: "Sell", path: "/kiosk/sell", icon: "💵" },
      { title: "Products", path: "/kiosk/products", icon: "🛒" },
      { title: "Daily Sales", path: "/kiosk/daily-sales", icon: "📈" },
    ],
  
    // Kinyozi Roles
    KINYOZI_ADMIN: [
      { title: "Services", path: "/kinyozi/services", icon: "✂️" },
      { title: "Staff", path: "/kinyozi/staff", icon: "🧑‍🎨" },
      { title: "Appointments", path: "/kinyozi/appointments", icon: "📅" },
      { title: "Reports", path: "/kinyozi/reports", icon: "📊" },
    ],
    KINYOZI_OPERATOR: [
      { title: "My Schedule", path: "/kinyozi/schedule", icon: "🕒" },
      { title: "Start Service", path: "/kinyozi/start", icon: "▶️" },
      { title: "Complete Service", path: "/kinyozi/complete", icon: "✅" },
    ],
  
    // Carwash Roles
    CARWASH_ADMIN: [
      { title: "Dashboard", path: "/carwash/dashboard", icon: "🧼" },
      { title: "Register Client", path: "/carwash/register", icon: "📝" },
      { title: "Manage Services", path: "/carwash/services", icon: "🧰" },
      { title: "Reports", path: "/carwash/reports", icon: "📊" },
    ],
    CARWASH_OPERATOR: [
      { title: "My Jobs", path: "/carwash/jobs", icon: "🚗" },
      { title: "Mark as Cleaned", path: "/carwash/complete", icon: "✅" },
    ],
  
    // Pharmacy Roles
    PHARMACY_ADMIN: [
      { title: "Inventory", path: "/pharmacy/inventory", icon: "💊" },
      { title: "Sales", path: "/pharmacy/sales", icon: "💰" },
      { title: "Prescriptions", path: "/pharmacy/prescriptions", icon: "📄" },
      { title: "Staff", path: "/pharmacy/staff", icon: "👥" },
    ],
    PHARMACY_CASHIER: [
      { title: "Sell", path: "/pharmacy/sell", icon: "💵" },
      { title: "Stock", path: "/pharmacy/stock", icon: "📦" },
      { title: "Sales Today", path: "/pharmacy/today", icon: "📈" },
    ],
  };
  