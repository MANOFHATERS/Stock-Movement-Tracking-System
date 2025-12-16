<p align="center">
  <img src="https://img.icons8.com/fluency/96/warehouse.png" alt="Stock Tracker Logo" width="80" height="80"/>
</p>

<h1 align="center">📦 Stock Movement & History Tracking System</h1>

<p align="center">
  <strong>A powerful full-stack inventory management solution with real-time stock tracking and complete audit trail</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17"/>
  <img src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18"/>
  <img src="https://img.shields.io/badge/OAuth2-Secured-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="OAuth2"/>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-screenshots">Screenshots</a>
</p>

---

## 🎯 Overview

The **Stock Movement & History Tracking System** is an enterprise-grade inventory management application designed to help businesses maintain accurate stock levels, process orders efficiently, and keep a complete, immutable history of all inventory changes.

### Why This Solution?

| Business Challenge | Our Solution |
|-------------------|--------------|
| ❌ Manual tracking errors | ✅ Automated stock calculations |
| ❌ No audit trail | ✅ Immutable history records |
| ❌ Overselling issues | ✅ Real-time stock validation |
| ❌ Lack of visibility | ✅ Dashboard with live metrics |

---

## ✨ Features

### 🔐 Secure Authentication
- **Google OAuth 2.0** - Login with your Google account
- **GitHub OAuth 2.0** - Login with your GitHub account
- No passwords to remember or manage

### 📦 Product Management
- Create, update, and delete products
- Track stock levels with visual indicators
- Search products by name or category
- Restock products with one click

### 🛒 Order Processing
- Create orders with multiple products
- Automatic stock reduction on order
- Cancel orders with automatic stock restoration
- Complete order history

### 📊 Stock History Tracking
- **Immutable audit trail** - Every change is permanently recorded
- **Change types tracked**: ORDER, CANCEL, RESTOCK, INITIAL_STOCK
- **Chronological timeline** - View complete product history
- **Previous/New quantities** - Full transparency on changes

### 📈 Dashboard Analytics
- Total products count
- Total orders processed
- Total stock units across inventory
- Low stock alerts

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 LTS | Core programming language |
| Spring Boot | 3.2 | Application framework |
| Spring Security | 6.x | OAuth2 authentication |
| Spring Data MongoDB | 4.x | Database operations |
| Lombok | Latest | Boilerplate reduction |
| Maven | 3.9+ | Build tool |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI library (Hooks only) |
| Vite | 5.x | Build tool & dev server |
| React Router | 6.x | Navigation |
| Axios | 1.x | HTTP client |
| Framer Motion | 11.x | Animations |
| React Hot Toast | 2.x | Notifications |
| React Icons | 5.x | Icon library |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL database |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Google Cloud | OAuth2 provider |
| GitHub | OAuth2 provider |

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Java 17** or higher ([Download](https://adoptium.net/))
- **Maven 3.9+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/Stock-Movement-Tracking-System.git
cd Stock-Movement-Tracking-System
```

#### 2️⃣ Configure Environment

Navigate to `backend/src/main/resources/application.yml` and update:

```yaml
spring:
  data:
    mongodb:
      uri: your-mongodb-atlas-uri
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: your-google-client-id
            client-secret: your-google-client-secret
          github:
            client-id: your-github-client-id
            client-secret: your-github-client-secret
```

#### 3️⃣ Start Backend Server
```bash
cd backend
mvn spring-boot:run
```
Backend will start at: `http://localhost:8080`

#### 4️⃣ Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
Frontend will start at: `http://localhost:5173`

#### 5️⃣ Open Application
Navigate to `http://localhost:5173` in your browser and login with Google or GitHub.

---

## 📁 Project Structure

```
Stock-Movement-Tracking-System/
├── 📂 backend/
│   ├── 📂 src/main/java/com/stocktracker/
│   │   ├── 📂 config/          # Security & OAuth configuration
│   │   ├── 📂 controller/      # REST API endpoints
│   │   ├── 📂 model/           # Data entities
│   │   ├── 📂 repository/      # Database access layer
│   │   └── 📂 service/         # Business logic layer
│   ├── 📂 src/main/resources/
│   │   └── 📄 application.yml  # Application configuration
│   └── 📄 pom.xml              # Maven dependencies
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI components
│   │   ├── 📂 context/         # React Context providers
│   │   ├── 📂 pages/           # Page components
│   │   ├── 📂 services/        # API service layer
│   │   ├── 📄 App.jsx          # Main application
│   │   └── 📄 index.css        # Global styles
│   ├── 📄 package.json         # NPM dependencies
│   └── 📄 vite.config.js       # Vite configuration
│
├── 📄 README.md
└── � screenshots/          # Application screenshots
```

---

## 📡 API Reference

### Products API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create new product |
| `PUT` | `/api/products/{id}` | Update product |
| `DELETE` | `/api/products/{id}` | Delete product |
| `GET` | `/api/products/{id}/stock-history` | Get stock history |
| `POST` | `/api/products/{id}/restock` | Add stock to product |
| `GET` | `/api/products/search?name=` | Search products |
| `GET` | `/api/products/low-stock?threshold=10` | Get low stock items |

### Orders API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Get all orders |
| `GET` | `/api/orders/{id}` | Get order by ID |
| `POST` | `/api/orders` | Create new order |
| `POST` | `/api/orders/{id}/cancel` | Cancel order |
| `DELETE` | `/api/orders/{id}` | Delete order |

### Authentication API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/oauth2/authorization/google` | Google login |
| `GET` | `/oauth2/authorization/github` | GitHub login |
| `GET` | `/api/auth/user` | Get current user |
| `POST` | `/api/auth/logout` | Logout |

---

## 📋 Business Rules

### Stock Management Rules

```
┌─────────────────────────────────────────────────────────────┐
│  📦 ORDER PLACED                                            │
│  ─────────────────                                          │
│  New Stock = Current Stock - Order Quantity                 │
│  History Entry: changeType = "ORDER", quantity = -N         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ❌ ORDER CANCELLED                                         │
│  ─────────────────                                          │
│  Restored Stock = Current Stock + Cancelled Quantity        │
│  History Entry: changeType = "CANCEL", quantity = +N        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📥 RESTOCK                                                 │
│  ─────────────────                                          │
│  New Stock = Current Stock + Restock Quantity               │
│  History Entry: changeType = "RESTOCK", quantity = +N       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🚫 VALIDATION                                              │
│  ─────────────────                                          │
│  IF Order Quantity > Available Stock                        │
│  THEN Reject Order with Error                               │
│  Stock can NEVER go negative                                │
└─────────────────────────────────────────────────────────────┘
```

### History Rules

- ✅ All stock changes are recorded automatically
- ✅ History entries are immutable (cannot be modified or deleted)
- ✅ Each entry stores previous and new quantities
- ✅ Reference ID links to related order when applicable

---

## 🖼 Screenshots

### Login Page
Modern dark theme with Google and GitHub OAuth options.

![Login Page](screenshots/login.png)

### Dashboard
Overview with statistics cards, quick actions, and recent products.

![Dashboard](screenshots/dashboard.png)

### Products Page
Product list with stock levels, search, and management actions.

![Products Page](screenshots/products.png)

### Stock History
Timeline view showing complete movement history for each product.

![Stock History](screenshots/stock-history.png)

### Orders Page
Order management with creation and cancellation capabilities.

![Orders Page](screenshots/orders.png)

---

## 🔒 Security Features

- **OAuth 2.0 Authentication** - Industry-standard secure authentication
- **Session Management** - Server-side session handling
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - All inputs validated on backend
- **HTTPS Ready** - Configured for secure production deployment

---

## 🚀 Deployment

### Environment Variables for Production

```yaml
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stocktracker

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Server
SERVER_PORT=8080
```

### Recommended Platforms

| Component | Platform | Free Tier |
|-----------|----------|-----------|
| Backend | Render | ✅ Yes |
| Frontend | Vercel | ✅ Yes |
| Database | MongoDB Atlas | ✅ Yes (512MB) |

---

## 📊 Data Models

### Product
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "name": "iPhone 15 Pro",
  "description": "Latest Apple flagship",
  "category": "Electronics",
  "availableQuantity": 50,
  "price": 999.99
}
```

### Order
```json
{
  "orderId": "507f1f77bcf86cd799439012",
  "status": "COMPLETED",
  "createdAt": "2024-12-15T10:30:00",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "iPhone 15 Pro",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "totalAmount": 1999.98,
  "userEmail": "user@example.com"
}
```

### StockHistory
```json
{
  "id": "507f1f77bcf86cd799439013",
  "productId": "507f1f77bcf86cd799439011",
  "productName": "iPhone 15 Pro",
  "changeType": "ORDER",
  "quantityChanged": -2,
  "previousQuantity": 50,
  "newQuantity": 48,
  "referenceId": "507f1f77bcf86cd799439012",
  "description": "Order placed",
  "createdAt": "2024-12-15T10:30:00"
}
```

---

## 🔮 Future Enhancements

- [ ] Bulk import/export via CSV
- [ ] Barcode/QR code scanning
- [ ] Multi-warehouse support
- [ ] Advanced analytics & reports
- [ ] Email notifications for low stock
- [ ] Mobile application
- [ ] E-commerce integrations (Shopify, WooCommerce)

---

## 👨‍💻 Developer

**Manoj C**

- Assignment: Full-Stack Intern - Task C (Data + Logic Heavy)
- Duration: 2 Days
- Status: ✅ Complete

---

## 📄 License

This project is developed as part of a technical assessment.

---

<p align="center">
  Made with ❤️ using Java, Spring Boot, MongoDB & React
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production_Ready-brightgreen?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/Code_Quality-A+-blue?style=flat-square" alt="Quality"/>
  <img src="https://img.shields.io/badge/Documentation-Complete-orange?style=flat-square" alt="Docs"/>
</p>
