# Mini E-Commerce API

A robust backend system for a mini e-commerce platform built with NestJS, TypeORM, and SQLite. This API provides comprehensive features for authentication, role-based access control, product management, shopping cart operations, and order processing with proper transaction handling.

## 🚀 Features

### Core Functionality
- ✅ **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/Customer)
  - Secure password hashing with bcrypt
  - User registration and login

- ✅ **Product Management (Admin Only)**
  - Create, read, update, and delete products
  - Manage product stock levels
  - Product availability tracking

- ✅ **Shopping Cart Operations**
  - Add products to cart
  - Update cart item quantities
  - Remove items from cart
  - Real-time stock validation

- ✅ **Order Processing**
  - Place orders from cart
  - Backend order total calculation
  - Automatic stock deduction after order
  - Database transactions for data consistency

- ✅ **Advanced Features**
  - Payment simulation
  - Order status management (Pending → Paid → Shipped → Delivered)
  - Order cancellation with stock restoration
  - Fraud prevention (repeated cancellations tracking)
  - Comprehensive error handling

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: SQLite (file-based, no installation required)
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt
- **Architecture**: Modular monolith with clear separation of concerns

## 📁 Project Structure

This project follows a modular architecture for better maintainability and scalability:

```
src/
├── modules/              # Feature modules (auth, users, products, cart, orders)
├── common/               # Shared utilities (guards, decorators, filters)
├── config/               # Configuration files
├── database/             # Migrations and seeds
└── shared/               # Constants and shared types
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed structure documentation.

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js (v18 or higher)
- npm or yarn package manager

**No database installation required!** SQLite is file-based and will be created automatically.

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MiniEcommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

The default configuration is ready to use with SQLite:

```env
# Database Configuration (SQLite - No installation required)
DB_DATABASE=database.sqlite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Note**: Update `JWT_SECRET` with a secure random string before deploying to production.

### 4. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `Admin@123`
- Customer user: `customer@example.com` / `Customer@123`
- Sample products

### 5. Run the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

**Database file**: The SQLite database file (`database.sqlite`) will be automatically created in your project root on first run.

## 📊 Database Schema

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

### Database Entities

#### User
- Stores user information with authentication credentials
- Tracks role (admin/customer)
- Maintains fraud detection metrics (cancelled orders count)

#### Product
- Product catalog with pricing and inventory
- Stock management
- Availability status

#### Cart & CartItem
- User's shopping cart
- Cart items with quantity tracking
- Automatic validation against product stock

#### Order & OrderItem
- Order records with status tracking
- Order items snapshot (price at time of order)
- Payment status management

## 🔐 API Endpoints

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "accessToken": "jwt-token"
}
```

#### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer {token}
```

### Products

#### Get All Products (Public)
```http
GET /api/v1/products
```

#### Get Product by ID (Public)
```http
GET /api/v1/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/v1/products
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 100,
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Product (Admin Only)
```http
PATCH /api/v1/products/:id
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 150
}
```

#### Update Stock (Admin Only)
```http
PATCH /api/v1/products/:id/stock
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "stock": 200
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/v1/products/:id
Authorization: Bearer {admin-token}
```

### Cart

#### Get Cart
```http
GET /api/v1/cart
Authorization: Bearer {token}
```

#### Add Item to Cart
```http
POST /api/v1/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 2
}
```

#### Update Cart Item
```http
PATCH /api/v1/cart/items/:itemId
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /api/v1/cart/items/:itemId
Authorization: Bearer {token}
```

#### Clear Cart
```http
DELETE /api/v1/cart
Authorization: Bearer {token}
```

### Orders

#### Create Order (Place Order)
```http
POST /api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "shippingAddress": "123 Main St, City, Country"
}
```

#### Get User's Orders
```http
GET /api/v1/orders
Authorization: Bearer {token}
```

#### Get All Orders (Admin Only)
```http
GET /api/v1/orders
Authorization: Bearer {admin-token}
```

#### Get Order by ID
```http
GET /api/v1/orders/:id
Authorization: Bearer {token}
```

#### Process Payment
```http
POST /api/v1/orders/:id/payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "credit_card",
  "transactionId": "txn_123456"
}
```

#### Update Order Status (Admin Only)
```http
PATCH /api/v1/orders/:id/status
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "status": "shipped"
}
```

**Available statuses:** `pending`, `paid`, `shipped`, `delivered`, `cancelled`

#### Cancel Order
```http
DELETE /api/v1/orders/:id
Authorization: Bearer {token}
```

## 🔒 Business Logic Implementation

### Stock Management
- Stock validation occurs before adding to cart
- Prevents adding more than available stock
- Stock is deducted ONLY after successful order placement
- Stock is restored if order is cancelled
- Prevents negative inventory

### Order Processing
- Orders are calculated on the backend (price × quantity)
- Uses database transactions for atomicity
- Cart is cleared after successful order
- Order items snapshot prices at time of purchase

### Fraud Prevention
- Tracks cancelled orders per user
- Blocks users with 5+ cancellations within 30 days
- Timestamp tracking of last cancellation

### Role-Based Authorization
- **Public**: View products
- **Customer**: Manage cart, place orders, view own orders
- **Admin**: Full product management, view all orders, update order status

### Payment Simulation
- 90% success rate simulation
- Updates order status to "paid" on success
- Maintains payment status tracking

## 🏗️ Architecture & Design Decisions

### Modular Architecture
- **Separation of Concerns**: Each feature module (Auth, Products, Cart, Orders) is independent
- **Dependency Injection**: Leverages NestJS DI for loose coupling
- **Service Layer**: Business logic encapsulated in services

### Database Design
- **Normalized Schema**: Prevents data redundancy
- **Soft Deletes**: Could be implemented for order history
- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Cascade Operations**: Automatic cleanup of related records

### Error Handling
- **Global Exception Filter**: Centralized error handling
- **HTTP Status Codes**: Proper status codes for all responses
- **Validation Pipes**: Input validation at DTO level
- **Custom Exceptions**: Meaningful error messages

### Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Stateless authentication
- **Token Expiration**: Configurable token lifetime
- **Protected Routes**: Guard-based authorization

### Transaction Management
- **Atomic Operations**: Critical operations use database transactions
- **Rollback on Failure**: Ensures data consistency
- **Stock Management**: Transactional stock deduction and restoration

## 🧪 Testing the API

### Create an Admin User

For testing purposes, you can manually create an admin user in your database:

```sql
INSERT INTO users (id, email, password, "firstName", "lastName", role, "isActive", "cancelledOrdersCount", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2b$10$YourHashedPasswordHere', -- Hash "admin123" using bcrypt
  'Admin',
  'User',
  'admin',
  true,
  0,
  NOW(),
  NOW()
);
```

Or use a database seeding script.

### Postman Collection

Import the following endpoints into Postman for easy testing:
1. Set up an environment variable `{{baseUrl}}` = `http://localhost:3000/api/v1`
2. Set up `{{token}}` variable to store JWT after login
3. Use the endpoints listed above

## 📝 Key Implementation Highlights

### 1. Transaction Handling
```typescript
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  // Perform multiple database operations
  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  throw error;
} finally {
  await queryRunner.release();
}
```

### 2. Stock Validation
```typescript
if (product.stock < quantity) {
  throw new BadRequestException(
    `Only ${product.stock} items available in stock`
  );
}
```

### 3. Backend Price Calculation
```typescript
const subtotal = Number(product.price) * cartItem.quantity;
totalAmount += subtotal;
```

### 4. Role-Based Guards
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
```

## 🚧 Assumptions Made

1. **Single Currency**: All prices are in one currency (no multi-currency support)
2. **Single Cart**: Each user has one active cart at a time
3. **Stock Units**: Stock is counted in whole numbers (no decimal quantities)
4. **Shipping**: Basic shipping address as string (no complex address validation)
5. **Payment**: Simulated payment (no real payment gateway integration)
6. **Email Verification**: Not implemented (users are active by default)
7. **Product Images**: URLs only (no file upload implementation)
8. **Tax Calculation**: Not included in order total
9. **Shipping Cost**: Not included in calculations

## 🔄 Future Enhancements

- [ ] Migration files instead of synchronize
- [ ] Unit and integration tests
- [ ] Swagger/OpenAPI documentation
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] Product categories and search functionality
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Discount codes and promotions
- [ ] Advanced inventory management
- [ ] API rate limiting
- [ ] Logging with Winston or Pino
- [ ] Caching with Redis
- [ ] File upload for product images
- [ ] Analytics and reporting endpoints

## 🐛 Error Handling Examples

### Insufficient Stock
```json
{
  "statusCode": 400,
  "timestamp": "2026-02-16T10:30:00.000Z",
  "path": "/api/v1/orders",
  "method": "POST",
  "message": "Insufficient stock for Product Name. Available: 5, Requested: 10"
}
```

### Unauthorized Access
```json
{
  "statusCode": 403,
  "timestamp": "2026-02-16T10:30:00.000Z",
  "path": "/api/v1/products",
  "method": "POST",
  "message": "You do not have permission to access this resource"
}
```

### Fraud Detection
```json
{
  "statusCode": 403,
  "timestamp": "2026-02-16T10:30:00.000Z",
  "path": "/api/v1/orders",
  "method": "POST",
  "message": "Your account has been flagged for suspicious activity. Please contact support."
}
```

## 📞 Support

For issues or questions, please create an issue in the repository.

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using NestJS**
