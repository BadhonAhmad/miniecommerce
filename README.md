# 🛒 Mini E-Commerce API

A production-ready backend system for a mini e-commerce platform built with **NestJS**, **TypeORM**, and **SQLite**. This RESTful API provides comprehensive features including JWT authentication, role-based access control, product management, shopping cart operations, and transactional order processing with **interactive Swagger documentation**.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Test Accounts](#-test-accounts)
- [Business Logic](#-business-logic)
- [Architecture](#️-architecture--design)
- [Testing](#-testing)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with Passport
- Role-based access control (Admin/Customer)
- Secure password hashing with bcrypt
- User registration and login
- Protected routes with guards

### 📦 Product Management (Admin Only)
- Full CRUD operations for products
- Stock level management
- Product availability tracking
- Real-time inventory updates

### 🛒 Shopping Cart
- Add/update/remove items from cart
- Real-time stock validation
- Automatic cart creation per user
- Cart persistence across sessions

### 💳 Order Processing
- Place orders from cart with transactions
- Backend order total calculation
- Automatic stock deduction
- Payment simulation (90% success rate)
- Order status management (Pending → Paid → Shipped → Delivered)
- Order cancellation with stock restoration

### 🔒 Security & Validation
- Input validation with class-validator
- Global exception handling
- Fraud prevention (repeated cancellation tracking)
- SQL injection protection via TypeORM
- CORS enabled

### 📖 API Documentation
- **Interactive Swagger UI** at `/api`
- Complete OpenAPI 3.0 specification
- Try endpoints directly from browser
- Auto-generated request/response examples
- JWT authentication support in Swagger

---

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: NestJS 11.x (Node.js framework)
- **Language**: TypeScript 5.x
- **Database**: SQLite (file-based, no installation required)
- **ORM**: TypeORM 0.3.x
- **Authentication**: Passport JWT
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt
- **Documentation**: Swagger/OpenAPI 3.0

### Architecture
- **Design Pattern**: Modular monolith
- **Code Structure**: Feature-based modules
- **Validation**: DTO-based with decorators
- **Error Handling**: Global exception filter
- **Transaction Management**: QueryRunner for atomicity

---

## 📁 Project Structure

```
MiniEcommerce/
├── src/
│   ├── modules/                    # Feature modules
│   │   ├── auth/                   # Authentication (login, register, profile)
│   │   ├── users/                  # User management
│   │   ├── products/               # Product CRUD (admin)
│   │   ├── cart/                   # Shopping cart operations
│   │   └── orders/                 # Order processing
│   ├── common/                     # Shared utilities
│   │   ├── guards/                 # JWT & Role guards
│   │   ├── decorators/             # Custom decorators (@GetUser, @Roles)
│   │   └── filters/                # Exception filters
│   ├── config/                     # Configuration
│   │   ├── app.config.ts           # App settings (port, env)
│   │   ├── database.config.ts      # SQLite configuration
│   │   └── jwt.config.ts           # JWT settings
│   ├── database/                   # Database utilities
│   │   └── seeds/                  # Database seeders
│   ├── shared/                     # Shared constants
│   │   └── constants.ts            # Enums (UserRole, OrderStatus, etc.)
│   ├── app.module.ts               # Root module
│   ├── app.controller.ts           # Root controller
│   └── main.ts                     # Application entry point (Swagger setup)
├── database.sqlite                 # SQLite database file (auto-generated)
├── postman_collection.json         # Postman collection for testing
├── .env                            # Environment variables
└── README.md                       # This file
```

### Module Responsibilities

| Module | Description |
|--------|-------------|
| **Auth** | User registration, login, JWT token generation, profile retrieval |
| **Users** | User entity and management |
| **Products** | CRUD operations, stock management (admin only) |
| **Cart** | Add/update/remove items, cart retrieval |
| **Orders** | Order creation, payment processing, status updates, cancellation |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager

**No database installation required!** SQLite is file-based and auto-created.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MiniEcommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration (SQLite - No installation required)
   DB_DATABASE=database.sqlite

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Application Configuration
   PORT=5001
   NODE_ENV=development
   ```

   > ⚠️ **Important**: Change `JWT_SECRET` to a strong random string in production!

4. **Seed the database** (Optional but recommended)
   ```bash
   npm run seed
   ```
   
   This creates:
   - **Admin user**: `admin@example.com` / `admin123`
   - **Customer user**: `customer@example.com` / `customer123`
   - **8 sample products** (Laptop, Mouse, Keyboard, etc.)

5. **Start the server**
   ```bash
   # Development mode with hot-reload
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access the application**
   - **API Base URL**: http://localhost:5001/api/v1
   - **Swagger UI**: http://localhost:5001/api 🎉
   - **OpenAPI JSON**: http://localhost:5001/api-json

---

## 📖 API Documentation

### 🎯 Interactive Swagger Documentation

The API comes with **fully interactive Swagger UI** documentation!

**Access it at**: http://localhost:5001/api

### Features:
- ✅ **Try API endpoints** directly from browser
- ✅ **Automatic request examples** for all endpoints
- ✅ **Response schemas** with examples
- ✅ **JWT authentication** built-in (click "Authorize" button)
- ✅ **Organized by tags**: Auth, Products, Cart, Orders
- ✅ **Download OpenAPI spec** in JSON format

### How to Use Swagger UI:

1. **Start the server**: `npm run start:dev`
2. **Open browser**: http://localhost:5001/api
3. **Login to get token**:
   - Click **POST /api/v1/auth/login**
   - Click **"Try it out"**
   - Use credentials: `customer@example.com` / `customer123`
   - Click **"Execute"**
   - Copy the `accessToken` from response
4. **Authorize**:
   - Click the **"Authorize" 🔓** button (top right)
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click **"Authorize"** then **"Close"**
5. **Test endpoints**: Now all protected endpoints will work! ✅

### API Endpoint Summary

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/auth/register` | POST | ❌ | Public | Register new user |
| `/auth/login` | POST | ❌ | Public | Login and get JWT token |
| `/auth/profile` | GET | ✅ | Any | Get current user profile |
| `/products` | GET | ❌ | Public | Get all products |
| `/products/:id` | GET | ❌ | Public | Get product by ID |
| `/products` | POST | ✅ | Admin | Create new product |
| `/products/:id` | PATCH | ✅ | Admin | Update product |
| `/products/:id` | DELETE | ✅ | Admin | Delete product |
| `/products/:id/stock` | PATCH | ✅ | Admin | Update product stock |
| `/cart` | GET | ✅ | Customer | Get user's cart |
| `/cart/items` | POST | ✅ | Customer | Add item to cart |
| `/cart/items/:id` | PATCH | ✅ | Customer | Update cart item quantity |
| `/cart/items/:id` | DELETE | ✅ | Customer | Remove item from cart |
| `/cart` | DELETE | ✅ | Customer | Clear entire cart |
| `/orders` | POST | ✅ | Customer | Create order from cart |
| `/orders` | GET | ✅ | Any | Get orders (all for admin, own for customer) |
| `/orders/:id` | GET | ✅ | Any | Get order by ID |
| `/orders/:id/payment` | POST | ✅ | Customer | Process payment |
| `/orders/:id/status` | PATCH | ✅ | Admin | Update order status |
| `/orders/:id` | DELETE | ✅ | Customer | Cancel order |

> 💡 **Tip**: Use Swagger UI instead of manually crafting requests!

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │         │   Product    │         │    Cart     │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │────┐    │ id (PK)      │    ┌────│ id (PK)     │
│ email       │    │    │ name         │    │    │ user_id(FK) │
│ password    │    │    │ description  │    │    └─────────────┘
│ firstName   │    │    │ price        │    │           │
│ lastName    │    │    │ stock        │    │           │
│ role        │    │    │ imageUrl     │    │           │
│ isActive    │    │    │ isAvailable  │    │           │
│ cancelled   │    │    └──────────────┘    │           │
│ OrdersCount │    │           │            │           │
└─────────────┘    │           │            │    ┌──────▼──────┐
       │           │           │            │    │  CartItem   │
       │           │           │            └────├─────────────┤
       │           │           │                 │ id (PK)     │
       │           │           └─────────────────│ cart_id(FK) │
       │           │                             │ product(FK) │
       │           │                             │ quantity    │
       │           │                             └─────────────┘
       │           │
       │           │     ┌──────────────┐
       │           └────▶│    Order     │
       │                 ├──────────────┤
       └────────────────▶│ id (PK)      │
                         │ user_id (FK) │
                         │ totalAmount  │
                         │ status       │
                         │ paymentStatus│
                         │ shipping...  │
                         └──────────────┘
                                │
                                │
                         ┌──────▼──────┐
                         │  OrderItem  │
                         ├─────────────┤
                         │ id (PK)     │
                         │ order_id(FK)│
                         │ product(FK) │
                         │ quantity    │
                         │ price       │
                         │ subtotal    │
                         └─────────────┘
```

### Entities

#### 👤 User
- **Authentication**: Email/password with bcrypt hashing
- **Roles**: `admin` or `customer`
- **Fraud Prevention**: Tracks cancelled order count
- **Relations**: Has one Cart, has many Orders

#### 📦 Product
- **Catalog**: Name, description, price, stock
- **Availability**: Boolean flag for active/inactive
- **Images**: URL-based (no file storage)
- **Relations**: Referenced by CartItems and OrderItems

#### 🛒 Cart & CartItem
- **One cart per user**: Auto-created on first add
- **CartItem**: Links cart to products with quantity
- **Validation**: Stock check before adding items
- **Relations**: Cart belongs to User, has many CartItems

#### 💼 Order & OrderItem
- **Order**: Total amount, status, payment status, shipping address
- **OrderItem**: Snapshot of product price at order time
- **Status Flow**: Pending → Paid → Shipped → Delivered
- **Relations**: Order belongs to User, has many OrderItems

---

## 🧪 Test Accounts

After running `npm run seed`, you'll have these test accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@example.com | admin123 | Full product management, view all orders, update statuses |
| **Customer** | customer@example.com | customer123 | Shopping cart, place orders, view own orders |

### Sample Products (After Seeding)
1. Laptop Pro 15" - $1,299.99
2. Wireless Mouse - $29.99
3. Mechanical Keyboard - $89.99
4. USB-C Hub - $49.99
5. Laptop Stand - $39.99
6. Webcam HD - $79.99
7. Bluetooth Speaker - $59.99
8. Phone Case - $19.99

---

## 🔒 Business Logic

### Stock Management
- ✅ Validates stock availability before adding to cart
- ✅ Prevents over-ordering (quantity ≤ available stock)
- ✅ Deducts stock **only after successful order placement**
- ✅ Restores stock if order is cancelled
- ✅ Never allows negative inventory

### Order Processing
1. **Cart to Order Conversion**:
   - Validates cart is not empty
   - Checks stock availability for all items
   - Calculates total on backend (price × quantity)
   - Uses **database transactions** for atomicity

2. **Transaction Flow**:
   ```
   START TRANSACTION
   ├─ Create Order
   ├─ Create OrderItems
   ├─ Deduct Product Stock
   ├─ Clear User's Cart
   └─ COMMIT (or ROLLBACK on error)
   ```

3. **Price Calculation**:
   - **Backend-only**: Never trusts client-side totals
   - Uses current product prices
   - OrderItem stores price snapshot for history

### Payment Simulation
- 90% success rate for testing
- Updates order status to `paid` on success
- Maintains separate `paymentStatus` field
- Can be replaced with real payment gateway

### Fraud Prevention
- Tracks cancelled orders per user
- Blocks users with **5+ cancellations in 30 days**
- Timestamp tracking of last cancellation
- Automatic reactivation after 30 days

### Role-Based Authorization

| Action | Public | Customer | Admin |
|--------|--------|----------|-------|
| View Products | ✅ | ✅ | ✅ |
| Manage Cart | ❌ | ✅ | ✅ |
| Place Orders | ❌ | ✅ | ✅ |
| View Own Orders | ❌ | ✅ | ✅ |
| View All Orders | ❌ | ❌ | ✅ |
| Create Products | ❌ | ❌ | ✅ |
| Update Products | ❌ | ❌ | ✅ |
| Delete Products | ❌ | ❌ | ✅ |
| Update Order Status | ❌ | ❌ | ✅ |

---

## 🏗️ Architecture & Design

### Modular Architecture
- **Feature-based modules**: Each business domain is isolated
- **Dependency Injection**: NestJS IoC container
- **Service layer**: Business logic separate from controllers
- **Repository pattern**: TypeORM repositories for data access

### Design Patterns Used
- **Module Pattern**: Feature modules (AuthModule, ProductsModule, etc.)
- **Repository Pattern**: TypeORM repositories
- **Guard Pattern**: JwtAuthGuard, RolesGuard
- **Decorator Pattern**: Custom decorators (@GetUser, @Roles)
- **Strategy Pattern**: Passport JWT strategy
- **Singleton Pattern**: NestJS services

### Security Best Practices
- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **JWT Tokens**: Stateless authentication
- ✅ **Input Validation**: DTO validation with class-validator
- ✅ **SQL Injection Prevention**: TypeORM parameterized queries
- ✅ **CORS**: Enabled for cross-origin requests
- ✅ **Environment Variables**: Sensitive data in .env
- ✅ **Role-based Access**: Guards on protected routes

### Transaction Management
```typescript
// Critical operations use transactions
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  // Multiple database operations...
  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  throw error;
} finally {
  await queryRunner.release();
}
```

### Error Handling
- **Global Exception Filter**: Centralized error handling
- **HTTP Status Codes**: Proper codes for all responses
  - 200 OK, 201 Created, 204 No Content
  - 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
  - 500 Internal Server Error
- **Validation Errors**: Detailed messages for invalid input
- **Custom Exceptions**: Business logic exceptions

---

## 🧪 Testing

### Using Swagger UI (Recommended)

1. Start server: `npm run start:dev`
2. Open: http://localhost:5001/api
3. Test all endpoints interactively! 🎉

### Using Postman

1. **Import Collection**: Import `postman_collection.json`
2. **Set Environment Variables**:
   - `baseUrl`: `http://localhost:5001/api/v1`
   - `token`: (auto-filled after login)
3. **Test Flow**:
   ```
   Login → Get Token → Authorize → Test Endpoints
   ```

### Manual Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"customer123"}'
```

**Get Products:**
```bash
curl http://localhost:5001/api/v1/products
```

**Add to Cart:**
```bash
curl -X POST http://localhost:5001/api/v1/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'
```

### Testing Workflow

#### Customer Flow:
1. Register/Login → Get JWT token
2. Browse Products → View available items
3. Add to Cart → Add products with quantity
4. View Cart → Verify items
5. Create Order → Place order from cart
6. Process Payment → Simulate payment
7. View Orders → Check order status

#### Admin Flow:
1. Login as Admin → Get JWT token
2. Create Product → Add new products
3. Update Stock → Manage inventory
4. View All Orders → See all customer orders
5. Update Order Status → Change to shipped/delivered

---

## 🚧 Assumptions & Limitations

### Current Assumptions
- ✅ Single currency (USD assumed)
- ✅ One cart per user
- ✅ Whole number stock quantities
- ✅ Simple shipping address (string)
- ✅ Simulated payment (no real gateway)
- ✅ No email verification required
- ✅ Product images as URLs only
- ✅ No tax or shipping cost calculation
- ✅ SQLite for simplicity (not for large-scale production)

### Known Limitations
- No product categories or search
- No product reviews/ratings
- No wishlist feature
- No discount/coupon codes
- No order tracking updates
- No real-time notifications
- No admin dashboard
- No file upload for images

---

## 🔄 Future Enhancements

### High Priority
- [ ] Unit and integration tests (Jest)
- [ ] Database migrations (replace synchronize)
- [ ] Email notifications (order confirmation, shipping)
- [ ] Product search and filtering
- [ ] Product categories/tags
- [ ] Pagination for large datasets

### Medium Priority
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Discount codes and promotions
- [ ] Order tracking with status history
- [ ] Admin dashboard API
- [ ] API rate limiting
- [ ] Request logging (Winston/Pino)

### Low Priority
- [ ] Redis caching for products
- [ ] File upload for product images
- [ ] Multi-currency support
- [ ] Advanced analytics endpoints
- [ ] Real payment gateway integration (Stripe, PayPal)
- [ ] Real-time notifications (WebSockets)
- [ ] Shipping cost calculation
- [ ] Tax calculation

---

## 📊 Performance Considerations

- **SQLite**: Suitable for small to medium applications
- **For Production**: Consider PostgreSQL or MySQL for better concurrency
- **Indexing**: Add indexes on frequently queried fields (email, product names)
- **Caching**: Consider Redis for product catalog
- **Connection Pooling**: Already handled by TypeORM

---

## 🐛 Troubleshooting

### Port Already in Use
**Problem**: `Port 5001 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:5001 | xargs kill -9
```

Or change port in `.env`:
```env
PORT=5002
```

### Database Locked Error
**Problem**: `database is locked`

**Solution**: SQLite doesn't handle high concurrency well. Consider PostgreSQL for production.

### JWT Token Expired
**Problem**: `401 Unauthorized` after some time

**Solution**: Login again to get a new token. Adjust `JWT_EXPIRES_IN` in `.env` if needed.

### Swagger Not Loading
**Problem**: Swagger UI not showing at `/api`

**Solution**:
1. Clear browser cache
2. Restart server: `npm run start:dev`
3. Try: http://localhost:5001/api (ensure correct port)

---

## 📄 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5001 | Server port |
| `NODE_ENV` | development | Environment (development/production) |
| `DB_DATABASE` | database.sqlite | SQLite database file path |
| `JWT_SECRET` | (required) | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | 7d | Token expiration time |

---

## 🎯 Project Goals & Philosophy

This project demonstrates:
- ✅ **Clean Architecture**: Separation of concerns, modular design
- ✅ **Best Practices**: TypeScript, validation, error handling
- ✅ **Security**: Authentication, authorization, input validation
- ✅ **Transaction Safety**: Atomic operations for critical flows
- ✅ **Developer Experience**: Swagger docs, type safety, hot reload
- ✅ **Production-Ready**: Environment configs, proper error handling

---

## 📚 Additional Resources

- **NestJS Documentation**: https://docs.nestjs.com
- **TypeORM Documentation**: https://typeorm.io
- **Swagger/OpenAPI**: https://swagger.io
- **JWT Best Practices**: https://jwt.io/introduction

---

## 💬 Support & Contribution

- **Issues**: Create an issue in the repository
- **Pull Requests**: Contributions are welcome!
- **Questions**: Check Swagger docs at `/api` first

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgments

Built with modern technologies:
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Feature-rich ORM
- **SQLite** - Lightweight database
- **Swagger** - API documentation

---

**🎉 Happy Coding! Built with ❤️ using NestJS**

---

## 📌 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server with hot-reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Seed database with test data
npm run seed

# Check for errors
npm run build
```

---

## 🔗 Important URLs

After starting the server (`npm run start:dev`):

| Resource | URL |
|----------|-----|
| **Swagger UI** | http://localhost:5001/api |
| **OpenAPI JSON** | http://localhost:5001/api-json |
| **API Base** | http://localhost:5001/api/v1 |
| **Health Check** | http://localhost:5001 |

---

**Last Updated**: February 2026
