# 🚚 Zyroo Local Delivery - Advanced Platform (Week 5)

A modern, **API-driven** Local Delivery & Logistics Management Platform built with React. Features role-based dashboards for Business, Riders, and Customers with real-time updates, advanced state management, and a production-ready UI.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Setup Instructions](#-setup-instructions)
- [Demo Accounts](#-demo-accounts)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Delivery Flow](#-delivery-flow)
- [Week Progress](#-week-progress)
- [Author](#-author)

---

## 🎯 Overview

Zyroo Local Delivery is a full-stack frontend prototype for managing local deliveries in Pakistan. It provides role-based dashboards for:

- **🏢 Business Users** — Create, edit, assign, and cancel delivery orders
- **🏍️ Riders** — Accept deliveries and update status in real-time
- **👤 Customers** — Track their orders with live status updates

**Week 5 Update:** The platform now uses a **REST API** (via JSON Server) instead of mock data, with **advanced state management** using React Context, **real-time polling**, and **optimistic UI updates**.

---

## 🔗 Live Demo

**[View Live Demo](https://zyroo-local-delievery.vercel.app/)**

> Frontend deployed on Vercel. API hosted separately.

---

## ✨ Features

### 🔐 Authentication (Week 2)
- Login / Register / Logout
- 3 User Roles: **Business**, **Rider**, **Customer**
- Role-based navigation & protected routes
- Demo accounts for quick testing

### 📦 Order Management (Week 3)
- **Create Order**, **Edit Order**, **Cancel Order**
- **Assign Rider** with modal selection
- **Order Status Flow** — Pending → Assigned → Accepted → Picked Up → In Transit → Delivered
- **Delivery Timeline** with status history

### 🗺️ Tracking & Notifications (Week 4)
- Live delivery tracking with real map (Leaflet)
- Route visualization
- Estimated delivery time
- Notification bell with unread count

### 🚀 Advanced Platform Integration (Week 5) ⭐ NEW
- **REST API Integration** — JSON Server providing `/users`, `/orders`, `/riders`, `/notifications`
- **Central API Service Layer** — `services/api.js`, `authService.js`, `orderService.js`, `riderService.js`, `notificationService.js`
- **Advanced State Management** — React Context (`AuthContext`, `OrdersContext`, `NotificationsContext`)
- **Real-Time Updates** — 30-second polling for live sync
- **Optimistic UI Updates** — Instant UI feedback with rollback on failure
- **Advanced Notifications** — Event-based auto-creation
- **Advanced Search & Filters** — Status, Rider, Date filters
- **Pagination** — 5 orders per page with Previous/Next controls
- **Loading / Error / Retry States** — Proper API state handling
- **Environment Configuration** — `.env` for API URL
- **Role-Based Actions** — Business, Rider, Customer permissions enforced

### 🎨 Design & UX
- Fully **responsive** (mobile, tablet, desktop)
- **Red-Orange theme** with modern gradients
- **Smooth animations** — fade, slide, pulse
- Clean, professional, production-ready UI

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **React Router DOM 7** | Client-side routing |
| **Vite 8** | Build tool & dev server |
| **JSON Server** | Mock REST API backend |
| **React Context** | State management |
| **Lucide React** | Icons |
| **Leaflet + React Leaflet** | Map integration |
| **CSS3** | Custom styling |
| **Vercel** | Frontend deployment |

---

## 📁 Architecture
zyroo-local-delievery/
├── db.json # Mock API database
├── .env # Environment variables (local)
├── .env.production # Environment variables (production)
├── src/
│ ├── api/
│ │ └── config.js # API URL & endpoints
│ ├── services/ # ⭐ Central API layer
│ │ ├── api.js # HTTP wrapper
│ │ ├── authService.js # Login / Register
│ │ ├── orderService.js # Orders CRUD
│ │ ├── riderService.js # Riders
│ │ └── notificationService.js # Notifications
│ ├── context/ # ⭐ State management
│ │ ├── AuthContext.jsx
│ │ ├── OrdersContext.jsx
│ │ └── NotificationsContext.jsx
│ ├── components/
│ │ ├── DeliveryMap.jsx
│ │ ├── Footer.jsx
│ │ ├── Navbar.jsx
│ │ └── ProtectedRoute.jsx
│ ├── data/
│ │ ├── mockData.js
│ │ └── users.js
│ ├── pages/
│ │ ├── CreateOrder.jsx
│ │ ├── Dashboard.jsx
│ │ ├── EditOrder.jsx
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Notifications.jsx
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

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ammara288/zyroo-local-delievery.git
   cd zyroo-local-delievery
   Install dependencies:
npm install

Create .env file in root:
VITE_API_URL=http://localhost:3001

Start Mock API (Terminal 1):
npm run server

API runs on http://localhost:3001

Start Frontend (Terminal 2):
npm run dev
App runs on http://localhost:5173
Open in browser: http://localhost:5173


👥 Demo Accounts
Role	                        Email	                              Password
🏢 Business	                  business@zyroo.com	               business123
🏍️ Rider	                   rider@zyroo.com	                   rider123
👤 Customer	                  customer@zyroo.com	               customer123
💡 Quick Login: Use the demo buttons on the Login page.

🔌 API Endpoints
JSON Server provides these REST endpoints:

Endpoint	                  Methods	                                        Purpose
/users	                  GET, POST, PUT, DELETE	                         User accounts
/orders	                  GET, POST, PUT, DELETE	                         Delivery orders
/riders	                  GET	                                           Rider list
/notifications	            GET, POST, PUT, DELETE	                         User notifications

Example:
GET http://localhost:3001/orders
GET http://localhost:3001/orders/DL001
POST http://localhost:3001/orders

📸 Screenshots
🏠 Home Page
https://screenshots/01-home.png

📊 Business Dashboard (API-driven)
https://screenshots/02-dashboard.png

📦 Orders Management (Search, Filters, Pagination)
https://screenshots/03-orders.png

🗺️ Live Tracking with Real Map
https://screenshots/04-tracking-map.png

🔔 Notifications (API-driven)
https://screenshots/05-notifications.png

📋 Order Details
https://screenshots/06-order-details.png

➕ Create Order Form
https://screenshots/07-create-order.png

🔐 Login Page
https://screenshots/08-login.png

📱 Mobile View
https://screenshots/09-mobile-home.png

💻 Tablet View
https://screenshots/10-tablet-home.png

🔄 Delivery Flow

1. Business Creates Order        →  API POST /orders
     ↓
2. Business Assigns Rider        →  API PUT /orders/:id
     ↓
3. Rider Accepts Delivery        →  API PUT /orders/:id
     ↓
4. Rider Picks Up Package        →  API PUT /orders/:id
     ↓
5. Order is In Transit           →  API PUT /orders/:id
     ↓
6. Customer Tracks via Live Map
     ↓
7. Rider Marks Delivered         →  API PUT /orders/:id
     ↓
8. Customer Receives Notification

Status Flow:

Pending → Assigned → Accepted → Picked Up → In Transit → Delivered

Role-Based Permissions

Action	                                     Business	                         Rider	                           Customer
Create Order	                                ✅	                               —	                                 —
Edit Order	                                   ✅	                               —	                                 —
Assign Rider	                                ✅	                               —                                 	—
Cancel Order	                                ✅	                               —                                	—
Accept Delivery	                             —	                                ✅	                              —
Update Status	                                —	                                ✅	                              —
Track Order	                                   ✅	                               ✅	                               ✅
View Notifications	                          ✅	                               ✅	                               ✅

📅 Week Progress
✅ Week 1: Frontend MVP
Home, Dashboard, Orders, Order Details, Tracking

✅ Week 2: Authentication & Roles
Login, Register, Logout
3 User Roles & Protected routes

✅ Week 3: Order & Delivery Management
Create, Edit, Assign, Cancel Orders
Rider Dashboard, Status Updates
Delivery Timeline

✅ Week 4: Tracking & Notifications
Live delivery tracking with real map
Notifications system
Search & filters

✅ Week 5: Advanced Platform Integration
REST API Integration (JSON Server)
Central API service layer
Advanced state management (React Context)
Real-time updates (30-second polling)
Optimistic UI updates
Advanced notifications (event-based)
Advanced search & filters
Pagination (5 orders per page)
Loading / Error / Retry states
Environment configuration (.env)


👤 Author
Ammara Batool
Frontend Development Intern @ ZYROO
GitHub: @Ammara288
Email: ammarabatool375@gmail.com
Location: Lahore, Pakistan
📝 License
Part of the ZYROO Frontend Development Internship Program (Week 1 - Week 5).
