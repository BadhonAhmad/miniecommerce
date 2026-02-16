# API Documentation - Mini E-Commerce

Base URL: `http://localhost:3000/api/v1`

## Table of Contents

1. [Authentication](#authentication)
2. [Products](#products)
3. [Cart](#cart)
4. [Orders](#orders)
5. [Response Formats](#response-formats)
6. [Error Codes](#error-codes)

---

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Register User

Create a new customer account.

**Endpoint**: `POST /auth/register`

**Access**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules**:
- `email`: Valid email format, required
- `password`: 6-50 characters, required
- `firstName`: 2-50 characters, required
- `lastName`: 2-50 characters, required

**Success Response** (201 Created):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "isActive": true,
    "createdAt": "2026-02-16T10:30:00.000Z",
    "updatedAt": "2026-02-16T10:30:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- `409 Conflict`: Email already exists
- `400 Bad Request`: Invalid input data

---

### Login

Authenticate and receive JWT token.

**Endpoint**: `POST /auth/login`

**Access**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (200 OK):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "isActive": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `401 Unauthorized`: Account is disabled

---

### Get Profile

Get current user's profile information.

**Endpoint**: `GET /auth/profile`

**Access**: Authenticated users only

**Headers**: 
```
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer",
  "isActive": true,
  "cancelledOrdersCount": 0,
  "createdAt": "2026-02-16T10:30:00.000Z",
  "updatedAt": "2026-02-16T10:30:00.000Z"
}
```

---

## Products

### Get All Products

List all available products.

**Endpoint**: `GET /products`

**Access**: Public

**Success Response** (200 OK):
```json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "name": "Laptop Pro 15\"",
    "description": "High-performance laptop with 16GB RAM",
    "price": "1299.99",
    "stock": 50,
    "imageUrl": "https://example.com/laptop.jpg",
    "isAvailable": true,
    "createdAt": "2026-02-16T10:00:00.000Z",
    "updatedAt": "2026-02-16T10:00:00.000Z"
  }
]
```

---

### Get Product by ID

Get detailed information about a specific product.

**Endpoint**: `GET /products/:id`

**Access**: Public

**Parameters**:
- `id` (path): Product UUID

**Success Response** (200 OK):
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "name": "Laptop Pro 15\"",
  "description": "High-performance laptop with 16GB RAM and 512GB SSD",
  "price": "1299.99",
  "stock": 50,
  "imageUrl": "https://example.com/laptop.jpg",
  "isAvailable": true,
  "createdAt": "2026-02-16T10:00:00.000Z",
  "updatedAt": "2026-02-16T10:00:00.000Z"
}
```

**Error Response**:
- `404 Not Found`: Product not found

---

### Create Product

Create a new product (Admin only).

**Endpoint**: `POST /products`

**Access**: Admin only

**Headers**: 
```
Authorization: Bearer <admin-token>
```

**Request Body**:
```json
{
  "name": "Laptop Pro 15\"",
  "description": "High-performance laptop",
  "price": 1299.99,
  "stock": 50,
  "imageUrl": "https://example.com/laptop.jpg"
}
```

**Validation Rules**:
- `name`: String, required
- `description`: String, required
- `price`: Number >= 0, required
- `stock`: Number >= 0, required
- `imageUrl`: String, optional

**Success Response** (201 Created):
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "name": "Laptop Pro 15\"",
  "description": "High-performance laptop",
  "price": "1299.99",
  "stock": 50,
  "imageUrl": "https://example.com/laptop.jpg",
  "isAvailable": true,
  "createdAt": "2026-02-16T10:00:00.000Z",
  "updatedAt": "2026-02-16T10:00:00.000Z"
}
```

**Error Responses**:
- `403 Forbidden`: Not authorized (not admin)
- `400 Bad Request`: Invalid input data

---

### Update Product

Update product details (Admin only).

**Endpoint**: `PATCH /products/:id`

**Access**: Admin only

**Headers**: 
```
Authorization: Bearer <admin-token>
```

**Parameters**:
- `id` (path): Product UUID

**Request Body** (all fields optional):
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 999.99,
  "stock": 75,
  "imageUrl": "https://example.com/new-image.jpg",
  "isAvailable": false
}
```

**Success Response** (200 OK):
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": "999.99",
  "stock": 75,
  "imageUrl": "https://example.com/new-image.jpg",
  "isAvailable": false,
  "createdAt": "2026-02-16T10:00:00.000Z",
  "updatedAt": "2026-02-16T12:00:00.000Z"
}
```

**Error Responses**:
- `403 Forbidden`: Not authorized
- `404 Not Found`: Product not found
- `400 Bad Request`: Invalid input data

---

### Update Product Stock

Update only the stock quantity (Admin only).

**Endpoint**: `PATCH /products/:id/stock`

**Access**: Admin only

**Headers**: 
```
Authorization: Bearer <admin-token>
```

**Parameters**:
- `id` (path): Product UUID

**Request Body**:
```json
{
  "stock": 100
}
```

**Validation Rules**:
- `stock`: Number >= 0, required

**Success Response** (200 OK):
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "name": "Laptop Pro 15\"",
  "description": "High-performance laptop",
  "price": "1299.99",
  "stock": 100,
  "imageUrl": "https://example.com/laptop.jpg",
  "isAvailable": true,
  "createdAt": "2026-02-16T10:00:00.000Z",
  "updatedAt": "2026-02-16T12:30:00.000Z"
}
```

**Error Responses**:
- `403 Forbidden`: Not authorized
- `404 Not Found`: Product not found
- `400 Bad Request`: Stock cannot be negative

---

### Delete Product

Delete a product (Admin only).

**Endpoint**: `DELETE /products/:id`

**Access**: Admin only

**Headers**: 
```
Authorization: Bearer <admin-token>
```

**Parameters**:
- `id` (path): Product UUID

**Success Response** (204 No Content)

**Error Responses**:
- `403 Forbidden`: Not authorized
- `404 Not Found`: Product not found

---

## Cart

### Get Cart

Get current user's shopping cart.

**Endpoint**: `GET /cart`

**Access**: Authenticated users

**Headers**: 
```
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440000",
      "quantity": 2,
      "product": {
        "id": "650e8400-e29b-41d4-a716-446655440000",
        "name": "Laptop Pro 15\"",
        "description": "High-performance laptop",
        "price": "1299.99",
        "stock": 48,
        "imageUrl": "https://example.com/laptop.jpg",
        "isAvailable": true
      }
    }
  ],
  "createdAt": "2026-02-16T10:00:00.000Z",
  "updatedAt": "2026-02-16T11:00:00.000Z"
}
```

**Error Response**:
- `404 Not Found`: Cart not found

---

### Add Item to Cart

Add a product to the shopping cart.

**Endpoint**: `POST /cart/items`

**Access**: Authenticated users

**Headers**: 
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "productId": "650e8400-e29b-41d4-a716-446655440000",
  "quantity": 2
}
```

**Validation Rules**:
- `productId`: Valid UUID, required
- `quantity`: Number >= 1, required

**Success Response** (201 Created):
Returns updated cart (same structure as Get Cart)

**Error Responses**:
- `400 Bad Request`: Product not available
- `400 Bad Request`: Only X items available in stock
- `404 Not Found`: Product not found

---

### Update Cart Item

Update quantity of an item in the cart.

**Endpoint**: `PATCH /cart/items/:itemId`

**Access**: Authenticated users

**Headers**: 
```
Authorization: Bearer <token>
```

**Parameters**:
- `itemId` (path): Cart item UUID

**Request Body**:
```json
{
  "quantity": 3
}
```

**Validation Rules**:
- `quantity`: Number >= 1, required

**Success Response** (200 OK):
Returns updated cart (same structure as Get Cart)

**Error Responses**:
- `404 Not Found`: Cart item not found
- `400 Bad Request`: Only X items available in stock

---

### Remove Item from Cart

Remove an item from the cart.

**Endpoint**: `DELETE /cart/items/:itemId`

**Access**: Authenticated users

**Headers**: 
```
Authorization: Bearer <token>
```

**Parameters**:
- `itemId` (path): Cart item UUID

**Success Response** (204 No Content)

**Error Response**:
- `404 Not Found`: Cart item not found

---

### Clear Cart

Remove all items from the cart.

**Endpoint**: `DELETE /cart`

**Access**: Authenticated users

**Headers**: 
```
Authorization: Bearer <token>
```

**Success Response** (204 No Content)

---

## Orders

### Create Order

Place an order from the current cart.

**Endpoint**: `POST /orders`

**Access**: Authenticated users

**Headers**: 
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "shippingAddress": "123 Main St, New York, NY 10001, USA"
}
```

**Validation Rules**:
- `shippingAddress`: String, required

**Success Response** (201 Created):
```json
{
  "id": "950e8400-e29b-41d4-a716-446655440000",
  "totalAmount": "2599.98",
  "status": "pending",
  "paymentStatus": "pending",
  "shippingAddress": "123 Main St, New York, NY 10001, USA",
  "items": [
    {
      "id": "a50e8400-e29b-41d4-a716-446655440000",
      "quantity": 2,
      "price": "1299.99",
      "subtotal": "2599.98",
      "product": {
        "id": "650e8400-e29b-41d4-a716-446655440000",
        "name": "Laptop Pro 15\"",
        "price": "1299.99"
      }
    }
  ],
  "createdAt": "2026-02-16T11:30:00.000Z",
  "updatedAt": "2026-02-16T11:30:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: Cart is empty
- `400 Bad Request`: Insufficient stock for [Product Name]
- `403 Forbidden`: Account flagged for suspicious activity (fraud prevention)

**Note**: This endpoint uses database transactions to ensure:
1. Stock is deducted atomically
2. Order is created successfully
3. Cart is cleared after order placement
4. All operations rollback if any step fails

---

### Get All Orders

Get orders for the current user (or all orders if admin).

**Endpoint**: `GET /orders`

**Access**: Authenticated users

**Headers**: 
```
Authorization: Bearer <token>
```

**Behavior**:
- **Customers**: Returns only their own orders
- **Admins**: Returns all orders from all users

**Success Response** (200 OK):
```json
[
  {
    "id": "950e8400-e29b-41d4-a716-446655440000",
    "totalAmount": "2599.98",
    "status": "pending",
    "paymentStatus": "pending",
    "shippingAddress": "123 Main St, New York, NY 10001, USA",
    "items": [
      {
        "id": "a50e8400-e29b-41d4-a716-446655440000",
        "quantity": 2,
        "price": "1299.99",
        "subtotal": "2599.98",
        "product": {
          "id": "650e8400-e29b-41d4-a716-446655440000",
          "name": "Laptop Pro 15\""
        }
      }
    ],
    "createdAt": "2026-02-16T11:30:00.000Z",
    "updatedAt": "2026-02-16T11:30:00.000Z"
  }
]
```

---

### Get Order by ID

Get details of a specific order.

**Endpoint**: `GET /orders/:id`

**Access**: Authenticated users (own orders only)

**Headers**: 
```
Authorization: Bearer <token>
```

**Parameters**:
- `id` (path): Order UUID

**Success Response** (200 OK):
Same structure as individual order in Get All Orders

**Error Response**:
- `404 Not Found`: Order not found

---

### Process Payment

Simulate payment for an order.

**Endpoint**: `POST /orders/:id/payment`

**Access**: Authenticated users

**Headers**: 
```
Authorization: Bearer <token>
```

**Parameters**:
- `id` (path): Order UUID

**Request Body** (optional):
```json
{
  "paymentMethod": "credit_card",
  "transactionId": "txn_123456789"
}
```

**Success Response** (200 OK):
```json
{
  "id": "950e8400-e29b-41d4-a716-446655440000",
  "totalAmount": "2599.98",
  "status": "paid",
  "paymentStatus": "completed",
  "shippingAddress": "123 Main St, New York, NY 10001, USA",
  "items": [...],
  "createdAt": "2026-02-16T11:30:00.000Z",
  "updatedAt": "2026-02-16T11:35:00.000Z"
}
```

**Error Responses**:
- `404 Not Found`: Order not found
- `400 Bad Request`: Payment already completed
- `400 Bad Request`: Cannot process payment for cancelled order
- `400 Bad Request`: Payment processing failed (10% failure rate simulation)

**Note**: Payment has a 90% success rate simulation.

---

### Update Order Status

Update order status (Admin only).

**Endpoint**: `PATCH /orders/:id/status`

**Access**: Admin only

**Headers**: 
```
Authorization: Bearer <admin-token>
```

**Parameters**:
- `id` (path): Order UUID

**Request Body**:
```json
{
  "status": "shipped"
}
```

**Valid Status Values**:
- `pending`
- `paid`
- `shipped`
- `delivered`
- `cancelled`

**Success Response** (200 OK):
Returns updated order

**Error Responses**:
- `403 Forbidden`: Not authorized
- `404 Not Found`: Order not found
- `400 Bad Request`: Invalid status value

---

### Cancel Order

Cancel an order and restore stock.

**Endpoint**: `DELETE /orders/:id`

**Access**: Authenticated users (own orders only)

**Headers**: 
```
Authorization: Bearer <token>
```

**Parameters**:
- `id` (path): Order UUID

**Success Response** (200 OK):
Returns cancelled order with status "cancelled"

**Error Responses**:
- `404 Not Found`: Order not found
- `400 Bad Request`: Order is already cancelled
- `400 Bad Request`: Cannot cancel order that has been shipped or delivered

**Note**: This endpoint uses database transactions to:
1. Restore product stock
2. Update order status to cancelled
3. Increment user's cancellation count (fraud prevention)
4. Rollback all changes if any step fails

**Fraud Prevention**: Users with 5+ cancellations within 30 days will be blocked from placing new orders.

---

## Response Formats

### Success Response

All successful responses follow standard REST conventions with appropriate HTTP status codes and JSON data.

### Error Response Format

All errors follow this structure:

```json
{
  "statusCode": 400,
  "timestamp": "2026-02-16T12:00:00.000Z",
  "path": "/api/v1/orders",
  "method": "POST",
  "message": "Insufficient stock for Laptop Pro 15\". Available: 5, Requested: 10"
}
```

---

## Error Codes

### 400 Bad Request
- Invalid input data
- Business rule violations (stock, payment status, etc.)
- Validation errors

### 401 Unauthorized
- Invalid credentials
- Missing or invalid JWT token
- Token expired

### 403 Forbidden
- Insufficient permissions (not admin)
- Account flagged (fraud prevention)

### 404 Not Found
- Resource not found (product, order, cart item, etc.)

### 409 Conflict
- Resource already exists (duplicate email)

### 500 Internal Server Error
- Unexpected server errors
- Database connection issues

---

## Best Practices

### Authentication
1. Store JWT tokens securely (not in localStorage for production)
2. Include token in Authorization header for all authenticated requests
3. Refresh tokens before expiration (implement refresh token flow if needed)

### Error Handling
1. Always check response status codes
2. Parse error messages for user feedback
3. Implement retry logic for network errors

### Pagination
Currently not implemented. All list endpoints return full results.
Consider implementing pagination for large datasets in production.

### Rate Limiting
Not currently implemented. Consider adding rate limiting in production.

---

## Postman Collection

Import `postman_collection.json` from the project root for a complete collection of all endpoints with example requests.

---

**Last Updated**: February 16, 2026
