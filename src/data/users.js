// Mock Users Data - Week 2 (Login/Register/Roles)
// In a real app, this would come from a backend

export const users = [
  // ===== BUSINESS USERS =====
  {
    id: "U001",
    name: "Ahmed Khan",
    email: "business@zyroo.com",
    password: "business123",
    role: "business",
    phone: "+92 300 1234567",
    company: "Khan Traders",
    address: "Mardan, KPK",
    city: "Mardan",
    avatar: "AK",
    joinedDate: "2026-01-15",
  },
  {
    id: "U002",
    name: "Fatima Ali",
    email: "fatima@business.com",
    password: "business123",
    role: "business",
    phone: "+92 301 2345678",
    company: "Ali Enterprises",
    address: "Peshawar, KPK",
    city: "Peshawar",
    avatar: "FA",
    joinedDate: "2026-02-20",
  },

  // ===== RIDER USERS =====
  {
    id: "U003",
    name: "Hamza Khan",
    email: "rider@zyroo.com",
    password: "rider123",
    role: "rider",
    phone: "+92 302 3456789",
    vehicle: "Motorcycle",
    vehicleNumber: "KHI-1234",
    address: "Mardan, KPK",
    city: "Mardan",
    avatar: "HK",
    rating: 4.8,
    totalDeliveries: 156,
    joinedDate: "2026-01-10",
  },
  {
    id: "U004",
    name: "Bilal Ahmed",
    email: "bilal@rider.com",
    password: "rider123",
    role: "rider",
    phone: "+92 303 4567890",
    vehicle: "Motorcycle",
    vehicleNumber: "KHI-5678",
    address: "Peshawar, KPK",
    city: "Peshawar",
    avatar: "BA",
    rating: 4.6,
    totalDeliveries: 89,
    joinedDate: "2026-02-05",
  },
  {
    id: "U005",
    name: "Usman Malik",
    email: "usman@rider.com",
    password: "rider123",
    role: "rider",
    phone: "+92 304 5678901",
    vehicle: "Van",
    vehicleNumber: "KHI-9012",
    address: "Islamabad, ICT",
    city: "Islamabad",
    avatar: "UM",
    rating: 4.9,
    totalDeliveries: 234,
    joinedDate: "2025-12-01",
  },

  // ===== CUSTOMER USERS =====
  {
    id: "U006",
    name: "Ali Khan",
    email: "customer@zyroo.com",
    password: "customer123",
    role: "customer",
    phone: "+92 305 6789012",
    address: "Timergara, KPK",
    city: "Timergara",
    avatar: "AK",
    joinedDate: "2026-03-01",
  },
  {
    id: "U007",
    name: "Sara Ahmed",
    email: "sara@customer.com",
    password: "customer123",
    role: "customer",
    phone: "+92 306 7890123",
    address: "Nowshera, KPK",
    city: "Nowshera",
    avatar: "SA",
    joinedDate: "2026-03-15",
  },

  // ===== ADMIN USER (Bonus) =====
  {
    id: "U008",
    name: "Admin Zyroo",
    email: "admin@zyroo.com",
    password: "admin123",
    role: "admin",
    phone: "+92 300 0000000",
    address: "Islamabad, ICT",
    city: "Islamabad",
    avatar: "AZ",
    joinedDate: "2025-11-01",
  },
];

// Helper: Get user initials for avatar
export const getUserInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Helper: Role display names
export const roleLabels = {
  business: "Business Owner",
  rider: "Delivery Rider",
  customer: "Customer",
  admin: "Administrator",
};

// Helper: Role colors
export const roleColors = {
  business: "#dc2626",
  rider: "#f97316",
  customer: "#2563eb",
  admin: "#7c3aed",
};