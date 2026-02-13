# API Documentation

## Overview

The Mini E-Commerce API provides endpoints for managing an online shopping platform with complete authentication, product management, cart operations, and order processing.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid auth token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## 1. Authentication

### 1.1 Register User

Create a new customer account.

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "Strong@Pass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Minimum 8 characters, must contain uppercase, lowercase, number, and special character
- `firstName`: 2-50 characters
- `lastName`: 2-50 characters

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER",
      "isActive": true,
      "failedOrders": 0,
      "createdAt": "2026-02-12T10:00:00.000Z",
      "updatedAt": "2026-02-12T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Login

Authenticate and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "Strong@Pass123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Get Profile

Retrieve authenticated user's profile.

**Endpoint:** `GET /api/auth/profile`

**Access:** Private (All authenticated users)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "isActive": true,
    "failedOrders": 0
  }
}
```

---

## 2. Products

### 2.1 Get All Products

Retrieve all active products (public endpoint).

**Endpoint:** `GET /api/products`

**Access:** Public

**Query Parameters:**
- `category` (optional): Filter by category

**Example:** `GET /api/products?category=Electronics`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "name": "Wireless Headphones",
      "description": "High-quality noise-cancelling headphones",
      "price": "99.99",
      "stock": 50,
      "category": "Electronics",
      "imageUrl": "https://example.com/image.jpg",
      "isActive": true,
      "createdAt": "2026-02-12T10:00:00.000Z",
      "updatedAt": "2026-02-12T10:00:00.000Z"
    }
  ]
}
```

---

### 2.2 Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Access:** Public

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "uuid-here",
    "name": "Wireless Headphones",
    "description": "High-quality noise-cancelling headphones",
    "price": "99.99",
    "stock": 50,
    "category": "Electronics",
    "imageUrl": "https://example.com/image.jpg",
    "isActive": true
  }
}
```

---

### 2.3 Create Product (Admin)

**Endpoint:** `POST /api/products`

**Access:** Private (Admin only)

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "Smart Watch",
  "description": "Fitness tracking smartwatch with heart rate monitor",
  "price": 299.99,
  "stock": 30,
  "category": "Electronics",
  "imageUrl": "https://example.com/watch.jpg"
}
```

**Validation Rules:**
- `name`: 3-200 characters, required
- `description`: 10-2000 characters, required
- `price`: Positive number, required
- `stock`: Non-negative integer, required
- `category`: Max 100 characters, optional
- `imageUrl`: Valid URL, optional

**Response:** `201 Created`

---

### 2.4 Update Product (Admin)

**Endpoint:** `PUT /api/products/:id`

**Access:** Private (Admin only)

**Request Body:**
```json
{
  "price": 279.99,
  "stock": 45,
  "isActive": true
}
```

**Response:** `200 OK`

---

### 2.5 Delete Product (Admin)

**Endpoint:** `DELETE /api/products/:id`

**Access:** Private (Admin only)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 3. Cart

All cart endpoints require authentication and customer role.

### 3.1 Get Cart

**Endpoint:** `GET /api/cart`

**Access:** Private (Customer only)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": "cart-uuid",
    "userId": "user-uuid",
    "items": [
      {
        "id": "item-uuid",
        "productId": "product-uuid",
        "quantity": 2,
        "product": {
          "id": "product-uuid",
          "name": "Wireless Headphones",
          "price": "99.99",
          "stock": 50,
          "imageUrl": "https://example.com/image.jpg"
        }
      }
    ],
    "createdAt": "2026-02-12T10:00:00.000Z",
    "updatedAt": "2026-02-12T10:30:00.000Z"
  }
}
```

---

### 3.2 Add to Cart

**Endpoint:** `POST /api/cart`

**Access:** Private (Customer only)

**Request Body:**
```json
{
  "productId": "product-uuid",
  "quantity": 2
}
```

**Validation:**
- Product must exist and be active
- Sufficient stock must be available
- Quantity must be at least 1

**Response:** `200 OK` (returns updated cart)

---

### 3.3 Update Cart Item

**Endpoint:** `PUT /api/cart/:productId`

**Access:** Private (Customer only)

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:** `200 OK` (returns updated cart)

---

### 3.4 Remove from Cart

**Endpoint:** `DELETE /api/cart/:productId`

**Access:** Private (Customer only)

**Response:** `200 OK` (returns updated cart)

---

### 3.5 Clear Cart

**Endpoint:** `DELETE /api/cart`

**Access:** Private (Customer only)

**Response:** `200 OK`

---

## 4. Orders

### 4.1 Create Order (Customer)

Place an order with current cart items.

**Endpoint:** `POST /api/orders`

**Access:** Private (Customer only)

**Request Body:**
```json
{
  "shippingAddress": "123 Main Street, Apt 4B, New York, NY 10001",
  "notes": "Please deliver after 5 PM"
}
```

**Validation Rules:**
- `shippingAddress`: 10-500 characters, required
- `notes`: Max 500 characters, optional
- Cart must not be empty
- All products must have sufficient stock

**Business Logic:**
1. Validates cart is not empty
2. Checks stock availability for all items
3. Calculates order total
4. Uses database transaction to:
   - Create order with items
   - Deduct stock for each product
   - Clear user's cart
5. Returns complete order details

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-1ABCD2EF-3456GH",
    "userId": "user-uuid",
    "totalAmount": "199.98",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "shippingAddress": "123 Main Street, Apt 4B, New York, NY 10001",
    "notes": "Please deliver after 5 PM",
    "items": [
      {
        "id": "item-uuid",
        "productId": "product-uuid",
        "productName": "Wireless Headphones",
        "price": "99.99",
        "quantity": 2,
        "subtotal": "199.98"
      }
    ],
    "createdAt": "2026-02-12T11:00:00.000Z",
    "updatedAt": "2026-02-12T11:00:00.000Z"
  }
}
```

---

### 4.2 Get User Orders

**Endpoint:** `GET /api/orders`

**Access:** Private (Customer only)

**Response:** `200 OK` (returns array of orders)

---

### 4.3 Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Access:** Private (Customer only - own orders)

**Response:** `200 OK`

---

### 4.4 Get All Orders (Admin)

**Endpoint:** `GET /api/orders/admin/all`

**Access:** Private (Admin only)

**Response:** `200 OK` (returns all orders from all users)

---

### 4.5 Update Order Status (Admin)

**Endpoint:** `PATCH /api/orders/admin/:id/status`

**Access:** Private (Admin only)

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

**Valid Status Values:**
- `PENDING`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Special Logic for CANCELLED:**
- Restores product stock
- Increments user's failed order count
- Used for fraud prevention

**Response:** `200 OK`

---

### 4.6 Simulate Payment (Admin)

**Endpoint:** `POST /api/orders/admin/:id/payment`

**Access:** Private (Admin only)

**Request Body:**
```json
{
  "success": true
}
```

**Logic:**
- `success: true` → Payment status: COMPLETED, Order status: PROCESSING
- `success: false` → Payment status: FAILED, Order status remains PENDING

**Response:** `200 OK`

---

## Error Examples

### 400 Bad Request
```json
{
  "success": false,
  "error": "Insufficient stock. Only 3 items available"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Product not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

---

## Rate Limiting

Currently not implemented. Future consideration.

## Pagination

Currently not implemented. All results are returned in full. Future enhancement planned.

---

## Testing Workflow

### Complete E-Commerce Flow

1. **Register** a customer account
   ```
   POST /api/auth/register
   ```

2. **Login** to get JWT token
   ```
   POST /api/auth/login
   ```

3. **Browse products**
   ```
   GET /api/products
   ```

4. **Add products to cart**
   ```
   POST /api/cart
   ```

5. **View cart**
   ```
   GET /api/cart
   ```

6. **Place order**
   ```
   POST /api/orders
   ```

7. **View order history**
   ```
   GET /api/orders
   ```

8. **Admin: Process payment**
   ```
   POST /api/orders/admin/:id/payment
   ```

9. **Admin: Update order status**
   ```
   PATCH /api/orders/admin/:id/status
   ```

---

## Security Notes

1. All passwords are hashed using bcrypt
2. JWT tokens expire after 7 days (configurable)
3. Sensitive information never exposed in responses
4. Input validation on all endpoints
5. Role-based access control strictly enforced
6. Database transactions ensure data consistency
