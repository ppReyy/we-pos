# 🍽️ Tanstack POS System - Restaurant Management

> **A modern, enterprise-grade Point of Sale system built for the next generation of restaurants**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker&logoColor=white)](https://docker.com)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)](https://postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.13-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

## 🌟 **Built with Modern Technologies**

- **⚡ Fullstack:** React + TanStack Start + TypeScript + Tailwind CSS + shadcn/ui
- **🗄️ Database:** PostgreSQL with comprehensive schema and optimized queries
- **🐳 Infrastructure:** Docker containers with Docker Compose orchestration
- **🔐 Security:** JWT authentication with role-based access control (RBAC)

---

## 📸 **Beautiful Professional Interface**

### 🍽️ Server Interface - Intuitive Order Management
![Dashboard Server Interface](gh-image/dashboard-server-interface.png)
*Clean, modern interface designed for speed and efficiency with real-time updates*

### 👨‍🍳 Enhanced Kitchen Display - As-Ready Service Workflow
![Dashboard Kitchen Interface](gh-image/dashboard-kitchen-interface.png)
*Professional tablet-optimized kitchen interface with individual item tracking and as-ready service*

**🎯 Kitchen Features:**
- **Individual Item Checklists** - Mark each dish ready independently
- **As-Ready Service** - Serve dishes as they're completed (real restaurant workflow)
- **Sound Notifications** - Audio alerts for new orders, ready items, and served dishes
- **Visual Progress Tracking** - "1 ready • 1 served • 1 cooking (67% complete)"
- **Touch-Optimized Design** - 50px+ touch targets for tablet and TV screens

### ✨ **Enterprise-Grade Admin Tables**
Our latest update includes **professional data tables** with:
- 📊 **Advanced sorting & filtering** with TanStack Table
- 🎨 **Beautiful visual design** with gradient avatars and color-coded indicators  
- 📱 **Responsive layout** that works perfectly on tablets and desktop
- ⚡ **Real-time search** with debouncing for instant results
- 🔄 **Table/Cards view toggle** for optimal data visualization

---

## 🚀 **Core Features**

### 💼 **Complete POS Functionality**
- **📋 Order Management**: Create, modify, and track customer orders with real-time kitchen updates
- **👨‍🍳 Enhanced Kitchen Workflow**: Professional as-ready service system with individual item tracking, sound notifications, and tablet-optimized interface
- **💳 Payment Processing**: Complete multi-step payment flow with receipt generation and payment history
- **🍕 Product Management**: Full menu and category management with pricing, images, and inventory control
- **🪑 Table Management**: Comprehensive table and seating arrangement system with availability tracking
- **👥 Multi-Role Support**: Role-based access control (Admin, Manager, Server, Counter, Kitchen)

### 🏢 **Advanced Admin Features**
- **📊 Comprehensive Admin Dashboard**: Complete control center with navigation to all system areas
- **🔄 Role-Based Interface Switching**: Admin can access and monitor all role interfaces seamlessly  
- **👤 Staff Management**: Create, manage, and delete user accounts with role assignments and permissions
- **💰 Financial Reporting**: Income reports, sales analytics, and performance metrics with visual charts
- **⚙️ System Settings**: Restaurant configuration, currency settings, tax rates, and operational parameters
- **📋 Menu Management**: Full CRUD operations for categories and products with advanced table views

### 🎯 **Role-Specific Interfaces**
- **🔑 Admin**: Full system access with comprehensive management dashboard and beautiful data tables
- **🍽️ Server**: Streamlined dine-in order creation interface optimized for speed
- **💰 Counter/Checkout**: All order types plus complete payment processing system
- **👨‍🍳 Kitchen**: Order preparation workflow with status updates and timing management

---

## ⚡ **Quick Start**

### 🚀 **One Command Startup**
```bash
# Start the entire system (easiest way)
npm run i
npm run dev

# Or use Docker Compose directly  
docker-compose up -d

# Access the applications
Frontend: http://localhost:3000
Database: localhost:5432
```

### 🎭 **Demo Accounts**

| Role | Username | Password | Access Level |
|------|----------|----------|-------------|
| **👑 Admin** | `admin` | `admin123` | Full system access, all interfaces, beautiful admin tables |
| **📊 Manager** | `manager1` | `admin123` | Business operations and oversight with reporting |
| **🍽️ Server** | `server1` / `server2` | `admin123` | Dine-in orders only with streamlined interface |
| **💰 Counter** | `counter1` / `counter2` | `admin123` | All orders + complete payment processing |
| **👨‍🍳 Kitchen** | `kitchen1` | `admin123` | Order preparation and status updates |

### 🎯 **First Login Experience**
1. **🌐 Navigate to**: http://localhost:3000
2. **🔑 Login as Admin**: Use `admin` / `admin123` for full system access
3. **📊 Explore Admin Dashboard**: Access all interfaces via the beautiful sidebar navigation
4. **🔄 Switch Interfaces**: Admin can view Server, Counter, Kitchen, and POS interfaces  
5. **⚙️ Manage System**: Create staff, manage menu with professional tables, configure settings

---

## 💻 **Technology Stack**

- **⚛️ TanStack Start** - Full-stack React framework with file-based routing
- **⚛️ React** - Latest React with concurrent features and hooks
- **📝 TypeScript** - Type-safe development with comprehensive type definitions
- **📊 TanStack Table** - Powerful data table with sorting, filtering, and pagination
- **🔄 TanStack Query** - Powerful data synchronization and caching
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **⚡ Vite** - Lightning-fast build tool and dev server
- **🧩 shadcn/ui + Radix UI** - Beautiful, accessible component library

### **🗄️ Database & Infrastructure**
- **🐘 PostgreSQL 15-Alpine** - Robust relational database with advanced features
- **📋 Comprehensive Schema** - Users, orders, products, payments, and audit logs
- **🔒 Role-based Security** - Database-level access control and permissions
- **⚡ Optimized Queries** - Strategically indexed for maximum performance
- **🐳 Docker Compose** - Containerized development and production environments
- **🟢 Node.js** - Modern JavaScript runtime for development tools

---

## 🤝 **Support the Project**

### 💝 **Open for Sponsorship & Donations**

This project represents hundreds of hours of development work, creating a modern, professional POS system that's **completely free and open source**. If you find this project valuable:

**🌟 Ways to Support:**
- ⭐ **Star this repository** to show your appreciation
- 🐛 **Report bugs** or suggest features to help improve the system
- 💰 **Sponsor development** to help maintain and add new features
- ☕ **Buy me a coffee** to fuel late-night coding sessions
- 🗣️ **Share the project** with other restaurant owners or developers

**💳 Donation Options:**
- **🌟 GitHub Sponsors** - Support ongoing development
- **💰 PayPal** - Send donations to: `arissetia.m@gmail.com` (one-time or recurring)
- **💎 Cryptocurrency** - Contact for wallet addresses
- **🏢 Commercial Licensing** - Enterprise support and customization available

*Every contribution helps make this project better for everyone! 🙏*

---

## 🚀 **Getting Started**

### **Prerequisites**
- Docker & Docker Compose
- Git (for cloning the repository)

## 🙏 **Acknowledgments**

- **⚛️ React Team** for the incredible frontend framework
- **🎨 Tailwind CSS** for making beautiful designs accessible
- **📊 TanStack** for the powerful table and query libraries
- **🧩 shadcn/ui** for the beautiful component system
- **🐳 Docker** for making deployment seamless

---

<div align="center">

### **⭐ Star this project if you find it useful! ⭐**

**Built with ❤️ by developers, for developers**

*Ready to transform your restaurant operations? Get started today!*

[🚀 **Get Started**](#-quick-start) • [💝 **Support the Project**](#-support-the-project) • [📚 **Documentation**](docs/) • [🐛 **Report Issues**](issues/)

</div>