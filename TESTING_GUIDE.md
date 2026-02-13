# Mini E-Commerce API - Testing Guide

## Testing Strategy

This guide covers manual testing, API testing with Postman, and verification of business rules.

## Prerequisites

- Server running at `http://localhost:3000`
- Database seeded with sample data
- Postman (or similar API testing tool) installed

## Test Data

### Admin Credentials
```
Email: admin@ecommerce.com
Password: Admin@123
```

### Customer Credentials
```
Email: customer@example.com
Password: Customer@123
```

---

## 1. Authentication Tests

### Test 1.1: User Registration

**Objective:** Verify new users can register successfully

**Steps:**
1. Send POST request to `/api/auth/register`
2. Include valid email, password, firstName, lastName

**Expected Result:**
- Status: 201 Created
- Response includes user object (without password) and JWT token
- User role is CUSTOMER by default

**Test Cases:**
```json
// Valid Registration
{
  "email": "test@example.com",
  "password": "Test@123",
  "firstName": "Test",
  "lastName": "User"
}

// Invalid: Weak Password
{
  "email": "test2@example.com",
  "password": "weak",
  "firstName": "Test",
  "lastName": "User"
}
// Expected: 400 Bad Request

// Invalid: Duplicate Email
{
  "email": "customer@example.com",
  "password": "Test@123",
  "firstName": "Test",
  "lastName": "User"
}
// Expected: 400 Bad Request - "User with this email already exists"
```

### Test 1.2: User Login

**Objective:** Verify authentication works correctly

**Test Cases:**
```json
// Valid Login
{
  "email": "customer@example.com",
  "password": "Customer@123"
}
// Expected: 200 OK with token

// Invalid Password
{
  "email": "customer@example.com",
  "password": "WrongPassword"
}
// Expected: 401 Unauthorized

// Non-existent User
{
  "email": "nonexistent@example.com",
  "password": "Password@123"
}
// Expected: 401 Unauthorized
```

### Test 1.3: Get Profile

**Objective:** Verify authenticated users can access their profile

**Steps:**
1. Login to get token
2. Send GET request to `/api/auth/profile` with Authorization header

**Expected Result:**
- Status: 200 OK
- Response includes user profile
- Password field is NOT included

---

## 2. Product Management Tests

### Test 2.1: Browse Products (Public)

**Objective:** Verify anyone can view active products

**Steps:**
1. Send GET request to `/api/products`
2. No authentication required

**Expected Result:**
- Status: 200 OK
- Returns array of active products only
- Each product includes price, stock, description

### Test 2.2: Filter Products by Category

**Steps:**
1. GET `/api/products?category=Electronics`

**Expected Result:**
- Returns only products in Electronics category

### Test 2.3: Create Product (Admin Only)

**Objective:** Verify only admins can create products

**Test Cases:**
```json
// Valid Product Creation (as Admin)
{
  "name": "Test Product",
  "description": "This is a test product for validation",
  "price": 99.99,
  "stock": 50,
  "category": "Test",
  "imageUrl": "https://example.com/test.jpg"
}
// Expected: 201 Created

// Attempt as Customer
// Expected: 403 Forbidden

// Invalid: Negative Price
{
  "name": "Invalid Product",
  "description": "Product with negative price",
  "price": -10,
  "stock": 50
}
// Expected: 400 Bad Request

// Invalid: Negative Stock
{
  "name": "Invalid Product",
  "description": "Product with negative stock",
  "price": 99,
  "stock": -5
}
// Expected: 400 Bad Request
```

### Test 2.4: Update Product (Admin Only)

**Objective:** Verify product updates work correctly

**Test Cases:**
```json
// Valid Update
{
  "price": 89.99,
  "stock": 75
}
// Expected: 200 OK

// Disable Product
{
  "isActive": false
}
// Expected: 200 OK
// Product should not appear in public product list
```

### Test 2.5: Delete Product (Admin Only)

**Objective:** Verify product deletion

**Steps:**
1. Create a test product
2. Delete it using DELETE `/api/products/:id`

**Expected Result:**
- Status: 200 OK
- Product no longer appears in product list

---

## 3. Cart Operations Tests

### Test 3.1: View Empty Cart

**Objective:** Verify cart is created automatically

**Steps:**
1. Login as new customer
2. GET `/api/cart`

**Expected Result:**
- Status: 200 OK
- Cart exists with empty items array

### Test 3.2: Add Product to Cart

**Objective:** Verify products can be added to cart

**Test Cases:**
```json
// Valid Addition
{
  "productId": "valid-product-id",
  "quantity": 2
}
// Expected: 200 OK, cart updated

// Insufficient Stock
{
  "productId": "product-id",
  "quantity": 999999
}
// Expected: 400 Bad Request - "Insufficient stock"

// Invalid Product
{
  "productId": "non-existent-id",
  "quantity": 1
}
// Expected: 404 Not Found
```

### Test 3.3: Update Cart Item Quantity

**Steps:**
1. Add product to cart
2. PUT `/api/cart/:productId` with new quantity

**Expected Result:**
- Status: 200 OK
- Cart reflects updated quantity

### Test 3.4: Remove from Cart

**Steps:**
1. Add product to cart
2. DELETE `/api/cart/:productId`

**Expected Result:**
- Status: 200 OK
- Product removed from cart

### Test 3.5: Add Same Product Twice

**Objective:** Verify quantities are accumulated

**Steps:**
1. Add product with quantity 2
2. Add same product with quantity 3

**Expected Result:**
- Cart has single item with quantity 5

---

## 4. Order Processing Tests

### Test 4.1: Place Order with Empty Cart

**Objective:** Verify orders require items

**Steps:**
1. Clear cart
2. POST `/api/orders`

**Expected Result:**
- Status: 400 Bad Request
- Error: "Cart is empty"

### Test 4.2: Place Valid Order

**Objective:** Verify complete order workflow

**Steps:**
1. Add products to cart
2. POST `/api/orders` with shipping address

**Test Data:**
```json
{
  "shippingAddress": "123 Main St, City, State, 12345",
  "notes": "Leave at door"
}
```

**Expected Result:**
- Status: 201 Created
- Order created with unique order number
- Order items include price snapshot
- Product stock decreased
- Cart cleared
- Order status: PENDING
- Payment status: PENDING

**Verify:**
- Check product stock decreased
- Cart is now empty
- Order appears in order history

### Test 4.3: Stock Validation on Order

**Objective:** Verify insufficient stock prevents order

**Steps:**
1. Add product with quantity exceeding stock
2. Attempt to place order

**Expected Result:**
- Status: 400 Bad Request
- Error: "Insufficient stock"
- No order created
- Stock unchanged

### Test 4.4: Price Snapshot

**Objective:** Verify order items store price at time of purchase

**Steps:**
1. Note product price
2. Add to cart and order
3. Admin updates product price
4. View order details

**Expected Result:**
- Order still shows original price
- Product in catalog shows new price

### Test 4.5: View Order History

**Steps:**
1. Place multiple orders
2. GET `/api/orders`

**Expected Result:**
- Returns all user's orders
- Sorted by creation date (newest first)

### Test 4.6: View Single Order

**Steps:**
1. GET `/api/orders/:orderId`

**Expected Result:**
- Returns complete order details
- Includes all order items with product info

### Test 4.7: Access Other User's Order

**Objective:** Verify order access control

**Steps:**
1. Login as Customer A, place order
2. Login as Customer B
3. Try to access Customer A's order

**Expected Result:**
- Status: 403 Forbidden

---

## 5. Admin Order Management Tests

### Test 5.1: View All Orders (Admin)

**Steps:**
1. Login as admin
2. GET `/api/orders/admin/all`

**Expected Result:**
- Returns all orders from all users
- Includes user information

### Test 5.2: Update Order Status

**Objective:** Verify order status transitions

**Test Cases:**
```json
// Mark as Processing
{"status": "PROCESSING"}
// Expected: 200 OK

// Mark as Shipped
{"status": "SHIPPED"}
// Expected: 200 OK

// Mark as Delivered
{"status": "DELIVERED"}
// Expected: 200 OK
```

### Test 5.3: Cancel Order

**Objective:** Verify stock restoration on cancellation

**Steps:**
1. Note product stock before order
2. Place order (stock decreases)
3. Admin cancels order
4. Check product stock

**Expected Result:**
- Order status: CANCELLED
- Product stock restored
- User's failedOrders count increased

### Test 5.4: Payment Simulation

**Test Cases:**
```json
// Successful Payment
{
  "success": true
}
// Expected:
// - Payment status: COMPLETED
// - Order status: PROCESSING

// Failed Payment
{
  "success": false
}
// Expected:
// - Payment status: FAILED
// - Order status: remains PENDING
```

---

## 6. Business Rules Tests

### Test 6.1: Negative Stock Prevention

**Steps:**
1. Create product with stock 5
2. Try to add 10 to cart
3. Try to update product with negative stock

**Expected Result:**
- Cannot add more than available stock to cart
- Cannot set product stock to negative value

### Test 6.2: Fraud Prevention

**Objective:** Verify account flagging after multiple cancellations

**Steps:**
1. Place and cancel order (repeat 5 times)
2. Attempt to place 6th order

**Expected Result:**
- First 5 orders work fine
- 6th order attempt fails with fraud prevention message

### Test 6.3: Transaction Atomicity

**Objective:** Verify all-or-nothing order creation

**Scenario:** Order with multiple items, one out of stock

**Expected Result:**
- Entire order fails
- No partial order created
- No stock deducted
- Cart unchanged

### Test 6.4: Price Calculation

**Objective:** Verify backend calculates totals

**Steps:**
1. Add multiple products to cart
2. Place order
3. Verify order total

**Expected Result:**
- Order total = sum of (price × quantity) for all items
- Calculated on backend (not from client)

---

## 7. Authorization Tests

### Test 7.1: Customer Cannot Access Admin Endpoints

**Test Cases:**
- Create product (POST `/api/products`)
- Update product (PUT `/api/products/:id`)
- Delete product (DELETE `/api/products/:id`)
- View all orders (GET `/api/orders/admin/all`)
- Update order status

**Expected Result:** 403 Forbidden for all

### Test 7.2: Admin Cannot Use Customer Cart

**Steps:**
1. Login as admin
2. Try to add to cart

**Expected Result:**
- 403 Forbidden (admins don't have carts)

### Test 7.3: Unauthenticated Access

**Test Cases:**
- View cart without token
- Place order without token
- Create product without token

**Expected Result:** 401 Unauthorized for all

---

## 8. Error Handling Tests

### Test 8.1: Invalid UUID Format

**Steps:**
1. GET `/api/products/invalid-id`

**Expected Result:**
- 404 Not Found

### Test 8.2: Malformed JSON

**Steps:**
1. POST request with invalid JSON

**Expected Result:**
- 400 Bad Request

### Test 8.3: Missing Required Fields

**Steps:**
1. POST `/api/products` with incomplete data

**Expected Result:**
- 400 Bad Request
- Clear error messages

---

## 9. Performance Tests (Manual)

### Test 9.1: Concurrent Order Placement

**Objective:** Verify stock deduction handles concurrency

**Setup:**
- Product with stock 5
- 10 customers try to order 1 each simultaneously

**Expected Result:**
- Only 5 orders succeed
- 5 orders fail with insufficient stock
- Final stock = 0

### Test 9.2: Large Cart

**Steps:**
1. Add 50 products to cart
2. Place order

**Expected Result:**
- Order processes successfully
- All 50 items in order
- Reasonable response time (<3 seconds)

---

## Test Automation (Future)

Recommended tools:
- **Unit Tests**: Jest
- **Integration Tests**: Supertest
- **E2E Tests**: Postman Newman
- **Load Tests**: Artillery or k6

---

## Test Results Template

```
Test ID: 1.1
Test Name: User Registration
Status: ✅ PASS / ❌ FAIL
Execution Date: 2026-02-12
Notes: 
```

---

## Bug Report Template

```
Bug ID: BUG-001
Title: [Brief description]
Severity: Critical / High / Medium / Low
Steps to Reproduce:
1.
2.
3.

Expected Result:
Actual Result:
Environment:
Logs/Screenshots:
```

---

## Testing Checklist

- [ ] All authentication endpoints tested
- [ ] All product CRUD operations tested
- [ ] Cart operations verified
- [ ] Order placement successful
- [ ] Order status transitions work
- [ ] Payment simulation works
- [ ] Stock management correct
- [ ] Fraud prevention active
- [ ] Authorization enforced
- [ ] Error handling appropriate
- [ ] Input validation working
- [ ] Data consistency maintained

---

## Known Limitations

1. No rate limiting (yet)
2. No pagination (returns all results)
3. No email notifications
4. Payment is simulated
5. No image upload (URLs only)

---

## Support

For issues or questions:
- Check API_DOCUMENTATION.md
- Review error messages
- Check server logs
- Verify database state with Prisma Studio
