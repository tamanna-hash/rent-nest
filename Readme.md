# 🏡 RentNest

> **A Secure Rental Property Management REST API**

RentNest is a robust backend REST API for a rental property management platform that connects **Landlords**, **Tenants**, and **Administrators** in a secure and efficient rental ecosystem.

The platform enables landlords to publish and manage property listings, tenants to discover properties, submit rental requests, complete secure payments through **Stripe**, and leave property reviews. Administrators have full control over users, categories, and platform management.

Built using a modern backend architecture with **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, **JWT Authentication**, and **Stripe Payment Integration**, RentNest focuses on scalability, maintainability, and clean API design.

---

## Tech Stack
![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## 📑 Table of Contents

- Overview
- Key Features
- Tech Stack
- Project Structure
- Database Schema
- API Endpoints
- Rental Lifecycle
- Installation
- Environment Variables
- Running the Project
- Stripe Webhook
- API Response Format
- Security Features
- Future Improvements
- Scripts
- Author
- License

## ✨ Key Features

### 🔐 Authentication & Authorization

- JWT Authentication (Access & Refresh Tokens)
- HTTP-only Cookie Support
- Password Hashing using bcryptjs
- Role-Based Authorization
- Protected API Routes

### 🏠 Property Management

- Create, Update and Delete Properties
- Browse Available Properties
- Search by Keywords
- Filter by Category and Price
- Pagination & Sorting

### 📝 Rental Management

- Submit Rental Requests
- Approve or Reject Requests
- Prevent Duplicate Requests
- Track Rental Status

### 💳 Payment System

- Stripe Payment Integration
- Payment Intent API
- Secure Webhook Verification
- Payment History
- Transaction Tracking

### ⭐ Reviews

- Leave Property Reviews
- Update or Delete Own Reviews
- Public Review Access

### 🛡️ Administration

- Manage Users
- Manage Property Categories
- Monitor Rental Requests

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| Authentication | JWT, bcryptjs |
| Payment Gateway | Stripe |
| Configuration | dotenv |
| API Testing | Postman |
| Development | ts-node-dev |

---

## Project Structure

```
RentNest/
├── generated/
│   └── prisma/                     # Auto-generated Prisma client
│       ├── models/                 # Individual model type files
│       ├── internal/               # Internal Prisma namespace files
│       ├── browser.ts
│       ├── client.ts
│       ├── commonInputTypes.ts
│       ├── enums.ts
│       └── models.ts
│
├── prisma/
│   ├── migrations/                 # Database migration history
│   └── schema/                     # Split Prisma schema files
│       ├── schema.prisma           # Datasource & generator config
│       ├── enums.prisma            # All enums (Role, UserStatus, RentalStatus, etc.)
│       ├── user.prisma
│       ├── property.prisma
│       ├── category.prisma
│       ├── rentalRequest.prisma
│       ├── payment.prisma
│       └── review.prisma
│
├── src/
│   ├── server.ts                   # Entry point — connects DB and starts server
│   ├── app.ts                      # Express app setup, middleware, route registration
│   │
│   ├── config/
│   │   └── index.ts                # Centralized environment variable config
│   │
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client singleton (with pg adapter)
│   │   └── stripe.ts               # Stripe client singleton
│   │
│   ├── middlewares/
│   │   ├── auth.ts                 # JWT auth middleware with role-based access control
│   │   ├── globalErrorHandler.ts   # Global error handler
│   │   └── notFound.ts             # 404 handler
│   │
│   ├── utils/
│   │   ├── catchAsync.ts           # Async error wrapper for controllers
│   │   ├── jwt.ts                  # JWT create/verify helpers
│   │   └── sendResponse.ts         # Standardized API response helper
│   │
│   └── modules/
│       ├── auth/                   # Registration, login, refresh token, profile
│       │   ├── auth.controller.ts
│       │   ├── auth.interface.ts
│       │   ├── auth.route.ts
│       │   └── auth.service.ts
│       │
│       ├── user/                   # Admin: list all users, ban/unban
│       │   ├── user.controller.ts
│       │   ├── user.interface.ts
│       │   ├── user.route.ts
│       │   └── user.service.ts
│       │
│       ├── admin/                  # Admin-specific routes (users, properties, rentals)
│       │   ├── admin.controller.ts
│       │   ├── admin.interface.ts
│       │   ├── admin.route.ts
│       │   └── admin.service.ts
│       │
│       ├── property/               # Property CRUD + search/filter
│       │   ├── property.controller.ts
│       │   ├── property.interface.ts
│       │   ├── property.route.ts
│       │   └── property.service.ts
│       │
│       ├── category/               # Property categories (admin manages, public reads)
│       │   ├── category.controller.ts
│       │   ├── category.interface.ts
│       │   ├── category.route.ts
│       │   └── category.service.ts
│       │
│       ├── rental/                 # Rental requests (tenant submit, landlord approve/reject)
│       │   ├── rental.controller.ts
│       │   ├── rental.interface.ts
│       │   ├── rental.route.ts
│       │   └── rental.service.ts
│       │
│       ├── subscription/           # Stripe payments (intent, webhook, history)
│       │   ├── subscription.controller.ts
│       │   ├── subscription.route.ts
│       │   ├── subscription.service.ts
│       │   └── subscription.utils.ts
│       │
│       ├── payment/                # Payment module (reserved / stub)
│       │   ├── payment.controller.ts
│       │   ├── payment.interface.ts
│       │   ├── payment.route.ts
│       │   └── payment.service.ts
│       │
│       └── review/                 # Tenant reviews for rented properties
│           ├── review.controller.ts
│           ├── review.interface.ts
│           ├── review.route.ts
│           └── review.service.ts
│
├── .env                            # Environment variables (see setup below)
├── .gitignore
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## Database Schema

| Model | Key Fields |
|---|---|
| User | id, name, email, password, role, status, phone, image, address |
| Property | id, title, description, location, price, bedrooms, bathrooms, amenities[], isAvailable, categoryId, landlordId |
| Category | id, name |
| RentalRequest | id, tenantId, propertyId, message, status (PENDING/APPROVED/REJECTED/ACTIVE/COMPLETED) |
| Payment | id, transactionId, amount, provider (STRIPE/SSLCOMMERZ), status (PENDING/COMPLETED/FAILED), paidAt, rentalRequestId |
| Review | id, tenantId, propertyId, rating, comment |

---

## API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register as TENANT or LANDLORD |
| POST | `/api/auth/login` | Public | Login, returns access + refresh token |
| POST | `/api/auth/refresh-token` | Public | Get new access token |
| GET | `/api/auth/me` | Auth | Get current user profile |
| PATCH | `/api/auth/me` | Auth | Update profile (name, phone, image) |

### Properties — `/api/properties`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/properties` | Public | List all properties with filters |
| GET | `/api/properties/:id` | Public | Get property details |
| POST | `/api/properties` | Landlord | Create a new property listing |
| PATCH | `/api/properties/:id` | Landlord / Admin | Update a property listing |
| DELETE | `/api/properties/:id` | Landlord / Admin | Remove a property listing |

**Available query filters:** `search`, `location`, `minPrice`, `maxPrice`, `propertyType`, `amenities`, `page`, `limit`

### Categories — `/api/categories`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/categories` | Public | Get all categories |
| GET | `/api/categories/:id` | Public | Get single category |
| POST | `/api/categories` | Admin | Create category |
| PATCH | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |

### Rental Requests — `/api/rentals`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/rentals` | Tenant | Submit a rental request |
| GET | `/api/rentals/my` | Tenant | Get own rental request history |
| DELETE | `/api/rentals/:id` | Tenant | Cancel a pending rental request |
| GET | `/api/rentals/landlord` | Landlord | View all requests for own properties |
| PATCH | `/api/rentals/:id/approve` | Landlord | Approve a rental request |
| PATCH | `/api/rentals/:id/reject` | Landlord | Reject a rental request |
| GET | `/api/rentals` | Admin | View all rental requests |

### Payments — `/api/payments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/create-payment-intent` | Tenant | Create Stripe PaymentIntent for approved rental |
| POST | `/api/payments/webhook` | Stripe | Stripe webhook (marks payment complete, sets rental ACTIVE) |
| GET | `/api/payments/my-payments` | Tenant | View own payment history |
| GET | `/api/payments/:id` | Tenant | Get single payment details |

### Reviews — `/api/reviews`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/reviews/property/:propertyId` | Public | Get all reviews for a property |
| POST | `/api/reviews` | Tenant | Create a review (requires ACTIVE/COMPLETED rental) |
| PATCH | `/api/reviews/:id` | Tenant | Update own review |
| DELETE | `/api/reviews/:id` | Tenant | Delete own review |

### Admin — `/api/admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | Get all users |
| PATCH | `/api/admin/users/:id` | Admin | Update user status (ban/unban) |
| GET | `/api/admin/properties` | Admin | Get all properties |
| GET | `/api/admin/rentals` | Admin | Get all rental requests |

---

## Rental Request Flow

```
PENDING → APPROVED → (Stripe payment) → ACTIVE → COMPLETED
        ↘ REJECTED
```

- Landlord approves/rejects a `PENDING` request
- On approval, property `isAvailable` is set to `false`
- Tenant pays via Stripe; webhook sets rental to `ACTIVE` and payment to `COMPLETED`
- Tenant can leave a review once rental is `ACTIVE` or `COMPLETED`

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Prisma Postgres)
- Stripe account (for payments)

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
DATABASE_URL="your_postgresql_connection_string"

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=_your_webhook_secret
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

### Stripe Webhook (local development)

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with tsx watch |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |

## 💙 A Note from the Developer

Hello! I'm **Tamanna**.

Building RentNest gave me the opportunity to deepen my understanding of backend development, RESTful API design, authentication, database modeling, role-based access control, and secure payment integration with Stripe.

I believe great software is built through continuous learning, curiosity, and persistence. Thank you for taking the time to explore my work. I hope you find it useful!

Thank you for checking out this project! ❤️