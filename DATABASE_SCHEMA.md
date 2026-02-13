# Database Entity Relationship Diagram

## Visual Representation

```
┌─────────────────────────────────────────────────┐
│                     User                        │
├─────────────────────────────────────────────────┤
│ • id: UUID (PK)                                 │
│ • email: String (Unique)                        │
│ • password: String (Hashed)                     │
│ • firstName: String                             │
│ • lastName: String                              │
│ • role: Enum (ADMIN, CUSTOMER)                  │
│ • isActive: Boolean                             │
│ • failedOrders: Integer                         │
│ • createdAt: DateTime                           │
│ • updatedAt: DateTime                           │
└────────────┬──────────────────┬─────────────────┘
             │                  │
             │ 1:1              │ 1:N
             │                  │
             ▼                  ▼
┌─────────────────────┐  ┌─────────────────────────┐
│       Cart          │  │        Order            │
├─────────────────────┤  ├─────────────────────────┤
│ • id: UUID (PK)     │  │ • id: UUID (PK)         │
│ • userId: UUID (FK) │  │ • orderNumber: String   │
│ • createdAt         │  │ • userId: UUID (FK)     │
│ • updatedAt         │  │ • totalAmount: Decimal  │
└──────────┬──────────┘  │ • status: Enum          │
           │             │ • paymentStatus: Enum   │
           │ 1:N         │ • shippingAddress: Str  │
           │             │ • notes: String         │
           ▼             │ • createdAt: DateTime   │
┌─────────────────────┐  │ • updatedAt: DateTime   │
│     CartItem        │  └───────────┬─────────────┘
├─────────────────────┤              │
│ • id: UUID (PK)     │              │ 1:N
│ • cartId: UUID (FK) │              │
│ • productId: (FK)   │◄─────┐       ▼
│ • quantity: Int     │      │  ┌──────────────────────┐
│ • createdAt         │      │  │     OrderItem        │
│ • updatedAt         │      │  ├──────────────────────┤
└─────────────────────┘      │  │ • id: UUID (PK)      │
                             │  │ • orderId: UUID (FK) │
                             │  │ • productId: (FK)    │
┌────────────────────────────┤  │ • productName: Str   │
│         Product            │  │ • price: Decimal     │
├────────────────────────────┤  │ • quantity: Int      │
│ • id: UUID (PK)            │  │ • subtotal: Decimal  │
│ • name: String             │  │ • createdAt          │
│ • description: String      │  └──────────────────────┘
│ • price: Decimal           │
│ • stock: Integer           │
│ • imageUrl: String         │
│ • category: String         │
│ • isActive: Boolean        │
│ • createdAt: DateTime      │
│ • updatedAt: DateTime      │
└────────────────────────────┘
```

## Relationship Details

### User ↔ Cart (One-to-One)
- Each user has exactly one cart
- A cart belongs to one user
- Cascade delete: When user is deleted, cart is deleted

### User ↔ Order (One-to-Many)
- A user can have multiple orders
- Each order belongs to one user
- Orders are preserved even if user is deleted (for business records)

### Cart ↔ CartItem (One-to-Many)
- A cart can have multiple cart items
- Each cart item belongs to one cart
- Cascade delete: When cart is deleted, all cart items are deleted

### Product ↔ CartItem (One-to-Many)
- A product can be in multiple cart items
- Each cart item refers to one product
- Cascade delete: When product is deleted, cart items are also removed

### Order ↔ OrderItem (One-to-Many)
- An order can have multiple order items
- Each order item belongs to one order
- Cascade delete: When order is deleted, all order items are deleted

### Product ↔ OrderItem (One-to-Many)
- A product can be in multiple orders
- Each order item refers to one product
- Product is NOT deleted if present in orders (for historical data)

## Enumerations

### UserRole
```typescript
enum UserRole {
  ADMIN
  CUSTOMER
}
```

### OrderStatus
```typescript
enum OrderStatus {
  PENDING      // Order created, awaiting payment
  PROCESSING   // Payment received, being prepared
  SHIPPED      // Order dispatched for delivery
  DELIVERED    // Order delivered to customer
  CANCELLED    // Order cancelled
}
```

### PaymentStatus
```typescript
enum PaymentStatus {
  PENDING      // Payment not yet processed
  COMPLETED    // Payment successful
  FAILED       // Payment failed
  REFUNDED     // Payment refunded
}
```

## Indexes

### User Table
- `email` - Unique index for faster lookups and constraint

### Product Table
- `category` - Index for filtering by category
- `isActive` - Index for filtering active/inactive products

### Order Table
- `userId` - Index for user's order queries
- `status` - Index for filtering by order status
- `orderNumber` - Unique index for order lookup

### CartItem Table
- `(cartId, productId)` - Unique composite index to prevent duplicate products in cart

## Data Integrity Rules

### Stock Management
1. Stock cannot be negative
2. Stock is deducted atomically when order is created
3. Stock is restored if order is cancelled
4. Stock validation happens before adding to cart and creating order

### Order Creation Transaction
The order creation process is wrapped in a database transaction to ensure:
1. Order record is created
2. Order items are created with price snapshot
3. Product stock is deducted for each item
4. Cart is cleared
5. All succeed or all fail (atomic operation)

### Fraud Prevention
- `failedOrders` field in User table tracks cancelled orders
- After N cancelled orders, user account is flagged
- Admins review flagged accounts

### Price and Product Name Snapshot
- `OrderItem` stores `productName` and `price` at time of purchase
- Historical accuracy preserved even if product is updated or deleted later

## Cascade Behaviors

| Parent | Child | Behavior |
|--------|-------|----------|
| User | Cart | CASCADE DELETE |
| Cart | CartItem | CASCADE DELETE |
| Product | CartItem | CASCADE DELETE |
| Order | OrderItem | CASCADE DELETE |
| User | Order | NO ACTION (preserve history) |
| Product | OrderItem | NO ACTION (preserve history) |

## Database Schema Size Estimates

For a typical e-commerce application:

- **Users**: ~10K - 1M records
- **Products**: ~1K - 100K records
- **Carts**: ~10K - 1M records (active users)
- **CartItems**: ~50K - 5M records (average 5 items/cart)
- **Orders**: ~100K - 10M records (historical data)
- **OrderItems**: ~500K - 50M records (average 5 items/order)

## Query Optimization

### Frequently Used Queries

1. **Get User's Cart with Items**
   ```sql
   SELECT * FROM carts 
   WHERE userId = ? 
   INCLUDE cart_items, products
   ```
   - Uses index on `userId`
   - Eager loading of relationships

2. **Get User's Orders**
   ```sql
   SELECT * FROM orders 
   WHERE userId = ? 
   ORDER BY createdAt DESC
   ```
   - Uses index on `userId`
   - Results sorted by creation date

3. **Get Active Products by Category**
   ```sql
   SELECT * FROM products 
   WHERE category = ? AND isActive = true
   ```
   - Uses indexes on `category` and `isActive`

4. **Stock Availability Check**
   ```sql
   SELECT stock FROM products 
   WHERE id = ?
   ```
   - Fast lookup using primary key

## Maintenance Considerations

### Periodic Tasks
1. **Archive old orders** (>1 year) to separate table
2. **Clean up abandoned carts** (inactive >30 days)
3. **Rebuild indexes** monthly for optimization
4. **Analyze query performance** and add indexes as needed

### Backup Strategy
- Daily full backups
- Hourly incremental backups
- Transaction log backups every 15 minutes
- 30-day retention policy
