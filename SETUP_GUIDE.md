# Quick Start Guide

This guide will help you get the Mini E-Commerce API up and running in minutes.

## Prerequisites Check

Before starting, make sure you have:

- ✅ Node.js v18+ installed
- ✅ PostgreSQL v14+ installed and running
- ✅ npm or yarn package manager
- ✅ Git (optional, for cloning)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js (web framework)
- Prisma (ORM)
- TypeScript (type safety)
- JWT (authentication)
- bcryptjs (password hashing)
- And more...

### 2. Configure Environment

Copy the example environment file:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` and update these values:

```env
# Update with your PostgreSQL connection string
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/mini_ecommerce?schema=public"

# Generate a strong random secret (use a password generator)
JWT_SECRET=your-secret-key-here

# Optional: Change admin credentials
ADMIN_EMAIL=admin@ecommerce.com
ADMIN_PASSWORD=Admin@123
```

### 3. Create Database

Create a PostgreSQL database:

```sql
CREATE DATABASE mini_ecommerce;
```

Or using psql command line:

```bash
psql -U postgres -c "CREATE DATABASE mini_ecommerce;"
```

### 4. Run Database Migrations

Generate Prisma Client and create database tables:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### 5. Start the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

You should see:

```
✅ Database connected successfully
🚀 Server running on port 3000
📍 Environment: development
🔗 API: http://localhost:3000/api
💚 Health Check: http://localhost:3000/api/health
```

### 6. Test the API

Open your browser or use curl:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Mini E-Commerce API is running",
  "timestamp": "2026-02-12T12:00:00.000Z"
}
```

## Default Accounts (After Seeding)

### Admin Account
```
Email: admin@ecommerce.com
Password: Admin@123
```

### Customer Account
```
Email: customer@example.com
Password: Customer@123
```

## Testing the Complete Flow

### 1. Login as Customer

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"Customer@123"}'
```

Copy the `token` from the response.

### 2. Browse Products

```bash
curl http://localhost:3000/api/products
```

### 3. Add Product to Cart

```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

### 4. View Cart

```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Place Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"shippingAddress":"123 Main St, City, State, ZIP","notes":"Deliver after 5 PM"}'
```

### 6. View Orders

```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Database Connection Error

**Error:** `Error: P1001: Can't reach database server`

**Solution:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in `.env`
3. Ensure database exists: `psql -l`

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
1. Change PORT in `.env` file
2. Or kill the process using port 3000

### Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npm run prisma:generate
```

### Migration Failed

**Error:** Migration errors

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then run migrations again
npm run prisma:migrate
npm run prisma:seed
```

## Development Tools

### Prisma Studio (Database GUI)

View and edit your database:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### View Logs

Development server shows detailed logs including:
- All HTTP requests (via morgan)
- Database queries (via Prisma)
- Error stack traces

## Next Steps

1. **Read the Documentation**
   - `README.md` - Complete project overview
   - `API_DOCUMENTATION.md` - Detailed API reference
   - `DATABASE_SCHEMA.md` - Database design details

2. **Test with Postman**
   - Import the API collection (if provided)
   - Or manually create requests

3. **Customize**
   - Add more product categories
   - Modify business rules
   - Extend with new features

## Common Commands

```bash
# Development
npm run dev                 # Start dev server with hot reload

# Database
npm run prisma:generate     # Generate Prisma Client
npm run prisma:migrate      # Run migrations
npm run prisma:seed         # Seed database
npm run prisma:studio       # Open database GUI

# Production
npm run build               # Compile TypeScript
npm start                   # Run production server

# Utilities
npm run prisma:reset        # Reset database (deletes data)
npm run prisma:migrate:reset # Reset and re-run migrations
```

## Performance Tips

1. **Database Indexes**: Already configured on frequently queried fields
2. **Connection Pooling**: Prisma handles this automatically
3. **Environment**: Set `NODE_ENV=production` for production builds

## Security Checklist

Before deploying:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Update admin credentials
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS in production
- [ ] Configure CORS appropriately
- [ ] Set up rate limiting (future enhancement)
- [ ] Enable database backups
- [ ] Review and test all security measures

## Getting Help

- Check the README.md for detailed information
- Review API_DOCUMENTATION.md for endpoint details
- Check DATABASE_SCHEMA.md for database structure
- Open an issue on GitHub (if applicable)

---

**Ready to build something awesome? Let's go! 🚀**
