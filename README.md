# Mini E-Commerce API

A comprehensive backend API for an online shopping platform with authentication, role-based access control, product management, cart operations, and order processing.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

## 🚀 Features

### ✨ Core Functionality

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Role-based access control (Admin/Customer)
  - Secure password hashing with bcrypt

- **Product Management** (Admin Only)
  - Create, read, update, and delete products
  - Stock management with validation
  - Product categorization
  - Active/inactive product states

- **Shopping Cart**
  - Add/remove products
  - Update quantities
  - Real-time stock validation
  - Clear cart functionality

- **Order Processing**
  - Place orders with cart items
  - Automatic stock deduction
  - Order status tracking (Pending → Processing → Shipped → Delivered)
  - Payment simulation
  - Order history

### 🛡️ Business Logic & Data Integrity

- **Stock Management**
  - Prevents negative inventory
  - Real-time stock validation
  - Stock restoration on order cancellation
  - Transaction-based stock updates

- **Fraud Prevention**
  - Track cancelled orders per user
  - Automatic account flagging after multiple cancellations
  - Configurable threshold for failed orders

- **Data Consistency**
  - Database transactions for critical operations
  - Atomic order creation and stock updates
  - Rollback on failures

## 🏗️ Architecture

### Design Pattern: Layered Architecture

```
┌─────────────────────────────────────┐
│         Controllers Layer           │  ← HTTP Request/Response
├─────────────────────────────────────┤
│         Services Layer              │  ← Business Logic
├─────────────────────────────────────┤
│         Repositories Layer          │  ← Data Access
├─────────────────────────────────────┤
│         Database (PostgreSQL)       │  ← Data Storage
└─────────────────────────────────────┘
```

### Project Structure

```
mini-ecommerce/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── src/
│   ├── config/               # Configuration files
│   │   ├── index.ts
│   │   └── database.ts
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── cart.controller.ts
│   │   └── order.controller.ts
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   └── order.service.ts
│   ├── repositories/         # Data access layer
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   ├── cart.repository.ts
│   │   └── order.repository.ts
│   ├── middlewares/          # Custom middleware
│   │   ├── auth.ts
│   │   ├── authorize.ts
│   │   ├── validate.ts
│   │   └── errorHandler.ts
│   ├── validators/           # Input validation
│   │   ├── auth.validator.ts
│   │   ├── product.validator.ts
│   │   ├── cart.validator.ts
│   │   └── order.validator.ts
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   └── index.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── errors.ts
│   │   ├── response.ts
│   │   ├── jwt.ts
│   │   └── helpers.ts
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │
│ password    │
│ firstName   │
│ lastName    │
│ role        │
│ isActive    │
│ failedOrders│
└──────┬──────┘
       │
       │ 1:1
       │
┌──────▼──────┐
│    Cart     │
├─────────────┤
│ id (PK)     │
│ userId (FK) │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│   CartItem      │
├─────────────────┤
│ id (PK)         │
│ cartId (FK)     │
│ productId (FK)  │
│ quantity        │
└─────────────────┘

┌─────────────┐
│   Product   │
├─────────────┤
│ id (PK)     │
│ name        │
│ description │
│ price       │
│ stock       │
│ category    │
│ isActive    │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│  OrderItem      │
├─────────────────┤
│ id (PK)         │
│ orderId (FK)    │
│ productId (FK)  │
│ productName     │
│ price           │
│ quantity        │
│ subtotal        │
└─────────────────┘

┌─────────────┐
│    Order    │
├─────────────┤
│ id (PK)     │
│ orderNumber │
│ userId (FK) │
│ totalAmount │
│ status      │
│ paymentStatus│
│ shippingAddr│
└─────────────┘
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **Logging**: morgan

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd MiniEcommerce
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mini_ecommerce?schema=public"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL=admin@ecommerce.com
ADMIN_PASSWORD=Admin@123
```

### Step 4: Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### Step 5: Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3000/api`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Strong@Pass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "token": "jwt-token"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Strong@Pass123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

---

### 📦 Product Endpoints

#### Get All Products (Public)
```http
GET /api/products?category=Electronics
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Wireless Headphones",
  "description": "High-quality noise-cancelling headphones",
  "price": 99.99,
  "stock": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg"
}
```

④ Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 89.99,
  "stock": 75
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin-token>
```

---

### 🛒 Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <customer-token>
```

#### Add to Cart
```http
POST /api/cart
Authorization: Bearer <customer-token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/:productId
Authorization: Bearer <customer-token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/:productId
Authorization: Bearer <customer-token>
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer <customer-token>
```

---

### 📋 Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <customer-token>
Content-Type: application/json

{
  "shippingAddress": "123 Main St, City, State, ZIP",
  "notes": "Please deliver after 5 PM"
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <customer-token>
```

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <customer-token>
```

#### Get All Orders (Admin)
```http
GET /api/orders/admin/all
Authorization: Bearer <admin-token>
```

#### Update Order Status (Admin)
```http
PATCH /api/orders/admin/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "SHIPPED"
}
```

**Status Options:** `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

#### Simulate Payment (Admin)
```http
POST /api/orders/admin/:id/payment
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "success": true
}
```

---

## 🔒 Security Features

- **Password Security**: Passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using express-validator
- **Role-Based Access**: Separate permissions for Admin and Customer roles
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Error Handling**: Custom error classes with appropriate HTTP status codes

## 🎯 Key Business Rules Implemented

1. ✅ Stock validation before adding to cart
2. ✅ Stock validation before order placement
3. ✅ Prevents negative inventory
4. ✅ Automatic stock deduction on successful order
5. ✅ Stock restoration on order cancellation
6. ✅ Order total calculated on backend
7. ✅ Transaction-based operations for data consistency
8. ✅ Fraud prevention through cancelled order tracking
9. ✅ Product price and name snapshot in orders
10. ✅ Multiple order status management

## 🧪 Testing the API

### Default Credentials (After Seeding)

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `Admin@123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `Customer@123`

### Sample Workflow

1. **Register/Login** as a customer
2. **Browse products** at `/api/products`
3. **Add products to cart** at `/api/cart`
4. **Place an order** at `/api/orders`
5. **View order history** at `/api/orders`
6. **Admin** can manage products and orders

## 🚧 Future Enhancements

- [ ] Email notifications for orders
- [ ] Password reset functionality
- [ ] Product reviews and ratings
- [ ] Advanced search and filtering
- [ ] Pagination for large datasets
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 📝 Key Architectural Decisions

### 1. Layered Architecture
- **Separation of Concerns**: Each layer has a specific responsibility
- **Maintainability**: Easy to modify and extend
- **Testability**: Each layer can be tested independently

### 2. Repository Pattern
- **Data Abstraction**: Business logic doesn't depend on data access details
- **Flexibility**: Easy to switch databases or add caching

### 3. Service Layer
- **Business Logic Centralization**: All business rules in one place
- **Reusability**: Services can be used by multiple controllers

### 4. Transaction Management
- **Data Integrity**: Critical operations use database transactions
- **Consistency**: Ensures all-or-nothing execution

### 5. Type Safety
- **TypeScript**: Catches errors at compile time
- **Interfaces**: Clear contracts between layers

### 6. Error Handling
- **Custom Error Classes**: Meaningful error messages
- **Centralized Handler**: Consistent error responses

## 🤝 Assumptions Made

1. Payment is simulated (no real payment gateway integration)
2. Email notifications are not implemented
3. Product images are stored as URLs (no file upload)
4. Shipping cost is not calculated
5. Tax calculation is not included
6. Single currency (USD assumed)
7. No product variants (size, color, etc.)
8. Simple fraud prevention (cancelled order count)

## 📄 License

ISC

## 👨‍💻 Author

Built with ❤️ for the Mini E-Commerce assignment

---

**Need Help?** Open an issue or contact the maintainer.
