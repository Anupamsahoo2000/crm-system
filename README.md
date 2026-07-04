# Mini Visitor CRM System

A full-stack Mini Visitor CRM System designed to register customers and track visitor check-ins, checkout history, and real-time dashboard analytics. Built with a React & Tailwind CSS v4 frontend and a Node.js, Express, and PostgreSQL (via Sequelize ORM) backend.

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, React Router, Axios, Lucide Icons
- **Backend**: Node.js, Express, Sequelize ORM, JWT, BcryptJS
- **Database**: PostgreSQL

---

## Sequelize Models

### 1. Customer Model (`backend/models/Customer.js`)

Tracks registered companies/customers.

- `id` (UUID): Primary Key (Auto-generated)
- `name` (String): Required, customer name
- `email` (String): Required, must be a unique and valid email address
- `phone` (String): Required, must be a valid 10-digit or international format
- `company` (String): Required, company name
- `status` (Enum): `'Active'` or `'Inactive'` (Default: `'Active'`)

### 2. Visitor Model (`backend/models/Visitor.js`)

Tracks visitor registrations and onsite durations.

- `id` (UUID): Primary Key (Auto-generated)
- `visitorName` (String): Required, visitor name
- `phone` (String): Required, must be a valid phone number
- `personToMeet` (String): Required, host staff member's name
- `purpose` (String): Required, purpose of visit
- `checkInTime` (Date): Required, defaulted to current time
- `checkOutTime` (Date): Nullable, timestamp set on check-out
- `status` (Enum): `'Checked-In'` or `'Checked-Out'` (Default: `'Checked-In'`)

---

## API Endpoints

All protected routes require a JWT token passed in the header as: `Authorization: Bearer <token>`.

### Authentication

- `POST /api/auth/login` - Authenticate admin credentials and return JWT token.

### Customers (Protected)

- `GET /api/customers?search=<query>` - Get all customers, with optional name/company search.
- `POST /api/customers` - Create a new customer record.
- `PUT /api/customers/:id` - Edit a customer record.
- `DELETE /api/customers/:id` - Remove a customer record.

### Visitors (Protected)

- `POST /api/visitors/checkin` - Check in a visitor.
- `PUT /api/visitors/checkout/:id` - Check out an active visitor (sets check-out timestamp and status).
- `GET /api/visitors/history` - Retrieve chronological visitor logs.

### Dashboard (Protected)

- `GET /api/dashboard/stats` - Fetch aggregate stats (Total Customers, Active Customers, Visitors Today, Checked-In Visitors) and recent records.

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** running locally

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
   DB_HOST=localhost
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

   _Note: On startup, Sequelize will automatically connect to PostgreSQL and create/sync the database and tables._

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

---

### Step 3: Run with Docker Compose (Alternative)

For a fully containerized deployment, you can run the entire stack (PostgreSQL, backend, and frontend) using Docker and Docker Compose.

#### Prerequisites
- **Docker** and **Docker Compose** installed on your system.

#### Build and Start Containers
From the root directory of the project, run:
```bash
docker compose up -d --build
```

This single command will:
1. Spin up a PostgreSQL 16 database.
2. Build and launch the Node.js backend on `http://localhost:5001`.
3. Build the frontend React app and serve it via Nginx on **`http://localhost:8080`**.

#### Stop Containers
To stop the services and retain data in postgres:
```bash
docker compose down
```

To stop services and completely delete database volumes:
```bash
docker compose down -v
```

---

## Demo Credentials

Use these dummy credentials to log in to the dashboard:

- **Email**: `admin@crm.com`
- **Password**: `password123`
