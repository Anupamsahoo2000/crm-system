# Mini Visitor CRM System

A full-stack Mini Visitor CRM System designed to register customers and track visitor check-ins, checkout history, and real-time dashboard analytics. Built with a React & Tailwind CSS v4 frontend and a Node.js, Express, and PostgreSQL (via Sequelize ORM) backend.

---

## Tech Stack
* **Frontend**: React, Vite, Tailwind CSS v4, React Router, Axios, Lucide Icons
* **Backend**: Node.js, Express, Sequelize ORM, JWT, BcryptJS
* **Database**: PostgreSQL

---

## Database Schemas

### 1. Customer Model
Tracks registered companies/customers.
```sql
CREATE TABLE "Customers" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "phone" VARCHAR(255) NOT NULL,
  "company" VARCHAR(255) NOT NULL,
  "status" VARCHAR(255) DEFAULT 'Active' CHECK ("status" IN ('Active', 'Inactive')),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### 2. Visitor Model
Tracks visitor registrations and onsite durations.
```sql
CREATE TABLE "Visitors" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "visitorName" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(255) NOT NULL,
  "personToMeet" VARCHAR(255) NOT NULL,
  "purpose" VARCHAR(255) NOT NULL,
  "checkInTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "checkOutTime" TIMESTAMP WITH TIME ZONE,
  "status" VARCHAR(255) DEFAULT 'Checked-In' CHECK ("status" IN ('Checked-In', 'Checked-Out')),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

---

## API Endpoints

All protected routes require a JWT token passed in the header as: `Authorization: Bearer <token>`.

### Authentication
* `POST /api/auth/login` - Authenticate admin credentials and return JWT token.

### Customers (Protected)
* `GET /api/customers?search=<query>` - Get all customers, with optional name/company search.
* `POST /api/customers` - Create a new customer record.
* `PUT /api/customers/:id` - Edit a customer record.
* `DELETE /api/customers/:id` - Remove a customer record.

### Visitors (Protected)
* `POST /api/visitors/checkin` - Check in a visitor.
* `PUT /api/visitors/checkout/:id` - Check out an active visitor (sets check-out timestamp and status).
* `GET /api/visitors/history` - Retrieve chronological visitor logs.

### Dashboard (Protected)
* `GET /api/dashboard/stats` - Fetch aggregate stats (Total Customers, Active Customers, Visitors Today, Checked-In Visitors) and recent records.

---

## Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **PostgreSQL** running locally

---

### Step 1: Clone and Configure Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_NAME=visitor_crm
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   ```
4. Start the backend server:
   ```bash
   # Production mode
   npm start
   
   # Development mode (with nodemon reload)
   npm run dev
   ```
   *Note: On startup, Sequelize will automatically connect to PostgreSQL and create/sync the database and tables.*

---

### Step 2: Configure and Start Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: **`http://localhost:5173`**

---

## Demo Credentials
Use these dummy credentials to log in to the dashboard:
* **Email**: `admin@crm.com`
* **Password**: `password123`
