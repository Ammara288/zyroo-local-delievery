# 🚚 Zyroo Local Delivery - Frontend MVP

A modern, role-based Local Delivery & Logistics Management Platform built with React. This project demonstrates a complete delivery workflow for Business owners, Riders, and Customers.

---

## 📋 Table of Contents

- [Overview](#-overview)
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
- **Live Tracking** — Delivery route and simulated rider location
- **Order Details** — Complete information with timeline

### 📍 Delivery Tracking & Notifications (Week 4)
- **Tracking Page** — Dedicated delivery tracking experience
- **Map Interface** — Simulated pickup, rider, route and delivery points
- **Rider Information** — Name, phone, vehicle, status and current location
- **Estimated Delivery** — Simulated ETA displayed on the tracking page
- **Delivery Timeline** — Pending → Assigned → Accepted → Picked Up → In Transit → Delivered
- **Notifications** — Navigation bell with notification badge and delivery updates
- **Search Orders** — Search by Order ID, customer name or rider name
- **Filters** — Filter orders by status, date and rider
- **Responsive Tracking** — Tracking interface adapts to mobile, tablet and desktop

### 📱 Design
- Fully **responsive** (mobile, tablet, desktop)
- **Red-Orange theme** with modern gradients
- **Smooth animations** and hover effects
- Clean, professional UI

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **React Router DOM 7** | Client-side routing |
| **Vite 8** | Build tool & dev server |
| **Lucide React** | Icons |
| **CSS3** | Custom styling |
| **localStorage** | Data persistence (mock backend) |

---

## 📁 Project Structure
