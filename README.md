# 🏡 UrbanNest — Full-Stack MERN Rental Property Management Platform

An enterprise-grade, production-ready SaaS platform built exclusively using **JavaScript**, **React.js**, **Tailwind CSS**, **Three.js**, **Node.js**, **Express.js**, **JWT**, and **MongoDB Atlas**.

---

## 🌟 Key Features & Capabilities

### 🔐 1. Authentication & Role-Based Authorization
- **Pure JWT & bcryptjs**: Secure password hashing, token expiration, authorization middleware (`authenticateUser`, `adminOnly`, `ownerOnly`, `tenantOnly`).
- **Protected React Routes**: Dynamic redirection and portal navigation isolating **Admin**, **Owner**, and **Tenant** dashboards.
- **Account Verification & Moderation**: Admin verification toggles and account suspension safeguards.

### 🏢 2. Property Listings & Discovery
- **Rich Specifications**: Photo galleries, carpet area, furnishings, bedrooms, bathrooms, security deposits, and amenities.
- **Approval Workflow**: Property submissions by owners enter admin moderation before going live publicly.
- **Advanced Multi-Criteria Search & Filter**: Real-time filtering by City, Price Range, Property Type, BHK, Furnishing, and Sorting order with pagination.
- **Interactive 3D Three.js Hero Canvas**: Dynamic architectural geometric wireframe and particle node constellation with mouse parallax.

### 📑 3. Complete Rental Lifecycle
- **Tenant Applications**: Screen prospective tenants with move-in dates, monthly income declarations, and occupant counts.
- **Digital Lease Agreements**: Automatic lease contract generation with **Printable & Downloadable PDF** templates and tenant digital counter-signatures.
- **Rent Billing & Payment Ledger**: Automated monthly invoicing, overdue tracking, and integrated simulated payment portal (UPI, Card, Bank Transfer).
- **Maintenance Ticketing**: Categorized repair requests (Plumbing, Electrical, Appliance, etc.) with priority tags, cost tracking, and tenant resolution confirmation.
- **Dispute Resolution / Complaints**: Formal grievance reporting with admin investigation triage.
- **Audit Logging**: Immutable system event logging for compliance and activity tracking.
- **In-App Notification Center**: Live badge counters, polling updates, and system-wide admin broadcasts.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rentalsystem.com` | `Password123!` | Platform Analytics, User Moderation, Property Approvals, Audit Logs, Dispute Resolution |
| **Owner** | `owner1@rentalsystem.com` | `Password123!` | Inventory Management, Tenant Application Review, Lease Issuance, Rent Ledger |
| **Tenant** | `tenant1@rentalsystem.com` | `Password123!` | Property Search, Bookmarks, Active Lease Viewer, Rent Payment Portal, Maintenance Tickets |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Three.js, Lucide Icons, Axios, React Router DOM v6.
- **Backend**: Node.js, Express.js, MongoDB Atlas with Mongoose ODM, JWT, bcryptjs, Helmet, CORS, Morgan.
- **Database**: MongoDB Atlas Cluster with indexed collections.

---

## 🚀 Running Locally

### 1. Backend Setup
```bash
cd server
npm install
npm run seed      # Seeds MongoDB Atlas with realistic demo dataset
npm run dev       # Starts Express API server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

---

## 📡 API Endpoints Overview

- `POST /api/auth/register` — Create new user account
- `POST /api/auth/login` — Authenticate and receive JWT
- `GET /api/properties` — Discover public approved properties with filters & search
- `POST /api/properties` — Owner creates new listing (submits for admin approval)
- `PATCH /api/admin/properties/:id/approval` — Admin approves or rejects property listing
- `POST /api/applications` — Tenant submits rental lease application
- `PATCH /api/applications/:id/status` — Owner reviews and approves application
- `POST /api/agreements` — Owner generates tenancy lease agreement
- `PATCH /api/agreements/:id/sign` — Tenant counter-signs agreement
- `GET /api/rents` — Retrieve monthly rent billing records
- `POST /api/payments` — Record simulated or offline rent payment
- `POST /api/maintenance` — Tenant submits maintenance ticket
- `PATCH /api/maintenance/:id/status` — Owner updates maintenance progress & repair costs
- `GET /api/notifications` — Retrieve notifications & unread count
- `GET /api/admin/dashboard-stats` — Aggregate platform-wide metrics & breakdowns
- `GET /api/admin/audit-logs` — Administrative audit trail

---

## 📄 License
MIT License. Created for production-grade full-stack residential property management.
