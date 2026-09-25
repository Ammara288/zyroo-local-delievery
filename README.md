# 🚚 Zyroo Local Delivery - Frontend MVP

A modern, role-based Local Delivery & Logistics Management Platform built with React. This project demonstrates a complete delivery workflow for Business owners, Riders, and Customers — with real-time map tracking, notifications, and a polished production-ready UI.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Demo Accounts](#-demo-accounts)
- [Screenshots](#-screenshots)
- [Delivery Flow](#-delivery-flow)
- [Week Progress](#-week-progress)
- [Author](#-author)

---

## 🎯 Overview

Zyroo Local Delivery is a frontend prototype for managing local deliveries in Pakistan. It provides role-based dashboards for:

- **🏢 Business Users** — Create, edit, assign, and cancel delivery orders
- **🏍️ Riders** — Accept deliveries and update status in real-time
- **👤 Customers** — Track their orders with live status updates

The project uses **mock data** stored in `localStorage` (no backend required), making it perfect for learning and prototyping.

---

## 🔗 Live Demo

**[View Live Demo](https://zyroo-local-delievery.vercel.app/)**

> Deployed on Vercel with auto-deploy from GitHub.

---

## ✨ Features

### 🔐 Authentication (Week 2)
- Login / Register / Logout
- 3 User Roles: **Business**, **Rider**, **Customer**
- Role-based navigation & protected routes
- Demo accounts for quick testing
- Persistent login (localStorage)

### 📦 Order Management (Week 3)
- **Create Order** — Business creates new delivery orders
- **Edit Order** — Update customer info, addresses, package details
- **Assign Rider** — Choose from available riders
- **Cancel Order** — With confirmation dialog
- **Order Status Flow** — Pending → Assigned → Accepted → Picked Up → In Transit → Delivered
- **Delivery Timeline** — Visual progress tracking
- **Status History** — Full audit log of status changes

### 🏍️ Rider Features
- **Rider Dashboard** — Assigned deliveries overview
- **Accept Delivery** — One-click accept
- **Update Status** — Mark as Picked Up, In Transit, Delivered
- **Delivery Stats** — Pending, Active, Completed

### 👤 Customer Features
- **My Orders** — View all personal orders
- **Live Tracking** — Real map with rider location
- **Order Details** — Complete information with timeline

### 📍 Delivery Tracking & Notifications (Week 4) 🆕
- **Tracking Page** — Dedicated delivery tracking experience
- **🗺️ Real Map Interface** — Interactive Leaflet map with OpenStreetMap
  - Pickup marker (📦 blue)
  - Rider marker (🏍️ red) — **animated**, moves along route
  - Delivery marker (🏠 green)
  - Red dashed route line connecting all points
  - Pulsing circle around rider location
- **Rider Information** — Name, avatar, phone, vehicle, status, current location
- **Estimated Delivery** — Simulated ETA on the tracking page
- **Delivery Timeline** — 6-step visual progress (Pending → Assigned → Accepted → Picked Up → In Transit → Delivered)
- **Status History** — Vertical timeline with timestamps
- **🔔 Notifications System**
  - Bell icon with unread count badge
  - Dropdown panel with recent notifications
  - Full notifications page (`/notifications`)
  - Filters: All / Unread / Read
  - Mark as read / Mark all as read / Clear all
  - localStorage persistence
- **🔍 Search Orders** — by Order ID, customer name, or rider name
- **🎛️ Filters** — Filter orders by status, date, and rider
- **📱 Responsive Tracking** — Works on mobile, tablet, and desktop

### 🎨 Design & UX
- Fully **responsive** (360px, 768px, 1440px)
- **Red-Orange theme** with modern gradients
- **Smooth animations** — fade, slide, pulse, hover
- **Progress bar** on Create Order form
- **Rider Action Panel** — Accept/Pickup/Deliver buttons
- Clean, professional, production-ready UI

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **React Router DOM 7** | Client-side routing |
| **Vite 8** | Build tool & dev server |
| **Leaflet 1.9** | Real map integration |
| **React Leaflet 4** | React wrapper for Leaflet |
| **Lucide React** | Icons |
| **CSS3** | Custom styling |
| **localStorage** | Data persistence (mock backend) |
| **Vercel** | Deployment |

---

## 📁 Project Structure
zyroo-local-delivery/
├── public/
├── src/
│ ├── components/
│ │ ├── DeliveryMap.jsx ⭐ NEW (Week 4)
│ │ ├── Footer.jsx
│ │ ├── Navbar.jsx
│ │ └── ProtectedRoute.jsx
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── data/
│ │ ├── mockData.js
│ │ └── users.js
│ ├── pages/
│ │ ├── CreateOrder.jsx
│ │ ├── Dashboard.jsx
│ │ ├── EditOrder.jsx
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Notifications.jsx ⭐ NEW (Week 4)
│ │ ├── OrderDetails.jsx
│ │ ├── Orders.jsx
│ │ ├── Register.jsx
│ │ └── Tracking.jsx
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── screenshots/
├── .gitignore
├── package.json
├── vite.config.js
└── README.md


---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ammara288/zyroo-local-delievery.git

# 2. Navigate to project folder
cd zyroo-local-delievery

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev

The app will open at http://localhost:5173 (or 5174 if port is busy).

Build for Production
npm run build

👥 Demo Accounts
Use these accounts to test different roles:

Role	                      Email	                                                   Password
🏢 Business                	business@zyroo.com                                       	business123
🏍️ Rider	                 rider@zyroo.com	                                         rider123
👤 Customer	                 customer@zyroo.com	                                         customer123
👑 Admin	                 admin@zyroo.com	                                         admin123
Quick Login: Use the demo buttons on the Login page.

📸 Screenshots
🏠 Home Page (Desktop)
https://screenshots/01-home.png

📊 Dashboard
https://screenshots/02-dashboard.png

📦 Orders Management (Search & Filters)
https://screenshots/03-orders.png

🗺️ Live Tracking with Real Map
https://screenshots/04-tracking-map.png

🔔 Notifications
https://screenshots/05-notifications.png

📋 Order Details
https://screenshots/06-order-details.png

➕ Create Order
https://screenshots/07-create-order.png

🔐 Login Page
https://screenshots/08-login.png

📱 Mobile View
https://screenshots/09-mobile-home.png

💻 Tablet View
https://screenshots/10-tablet-home.png

🔄 Delivery Flow
Complete Workflow

1. Business Creates Order
   ↓
2. Business Assigns Rider
   ↓
3. Rider Accepts Delivery
   ↓
4. Rider Picks Up Package
   ↓
5. Order is In Transit
   ↓
6. Customer Tracks via Real Map
   ↓
7. Rider Marks Delivered
   ↓
8. Customer Receives Notification

Status Flow
Pending → Assigned → Accepted → Picked Up → In Transit → Delivered

Role-Based Views
Step	                     Business	                  Rider	                 Customer
Create Order	                ✅	                     —	                       —
Assign Rider	                ✅	                     —	                       —
Accept Delivery              	—	                      ✅	                       —
Update Status	                —	                      ✅	                       —
Track Order                  	✅	                     ✅	                     ✅
View Notifications	            ✅	                     ✅	                     ✅

📅 Week Progress


Week 2 — Authentication & Roles ✅

Login / Register / Logout
3 user roles (Business, Rider, Customer)
Protected routes
Role-based navigation
Demo accounts

Week 3 — Order Management ✅

Create / Edit / Cancel order
Rider assignment
Delivery status updates
Rider action panel
Customer order views

Week 4 — Delivery Tracking & Notifications ✅

Real Leaflet map with OpenStreetMap
Animated rider marker with pulsing circle
Pickup / Rider / Delivery markers
Red dashed route line
Notification system
Bell icon with badge
Dropdown panel
Full notifications page
Filters (All / Unread / Read)
Search orders (Order ID, Customer, Rider)
Filter orders (Status, Date, Rider)
Responsive design (mobile, tablet, desktop)
Smooth animations & transitions
Progress bar on Create Order
Delivery timeline (6 steps)

✅ Week 4 Success Criteria
☑ Users can view delivery progress
☑ Basic rider and route information displayed
☑ Delivery updates via notifications
☑ Find orders using search and filters
☑ Responsive on mobile, tablet, desktop
☑ Real map interface (Leaflet + OpenStreetMap)
☑ Animated rider marker
☑ Notification badge on navbar

🎨 Design Highlights
Theme: Red-Orange gradient (#dc2626 → #f97316)
Typography: Segoe UI, clean hierarchy
Cards: Soft shadows, hover lift effects
Buttons: Gradient backgrounds, smooth transitions
Animations: fadeIn, fadeInUp, pulse, markerPulse
Icons: Lucide React (consistent style)
Map: CartoDB Light tiles (clean, modern)

👤 Author

Ammara Batool
GitHub: @Ammara288
Email: ammarabatool375@gmail.com
Location: Lahore, Pakistan

📝 License

This project is created as part of the Zyroo Internship Program — Week 4 Task (Delivery Tracking & Notifications). Free to use for learning purposes.