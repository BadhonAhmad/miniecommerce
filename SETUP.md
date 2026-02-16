# Setup Guide - Mini E-Commerce API

This guide will walk you through setting up the Mini E-Commerce API from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

### 1. Node.js and npm
- **Node.js version**: 18.x or higher
- **npm version**: 9.x or higher

Check your versions:
```bash
node --version
npm --version
```

Download from: https://nodejs.org/

### 2. Database
- **SQLite** - No installation required! SQLite is a file-based database that comes bundled with the project dependencies.
- The database file (`database.sqlite`) will be automatically created when you start the application.

## Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd MiniEcommerce
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- NestJS framework
- TypeORM
- SQLite database (file-based, no server needed)
- JWT authentication
- and more...

### Step 3: Configure Environment Variables (Optional)

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. The `.env` file is already configured with sensible defaults:

```env
# Database Configuration (SQLite - No installation required)
DB_DATABASE=database.sqlite

# JWT Configuration
JWT_SECRET=change-this-to-a-random-secret-string-min-32-chars
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Important**: 
- The SQLite database file will be automatically created when you start the app
- Generate a secure JWT secret (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)

### Step 4: Start the Application

```bash
npm run start:dev
```

The database file (`database.sqlite`) will be automatically created in your project root, and all tables will be set up automatically.

If you see the following, everything is working:
```
Application is running on: http://localhost:3000
Environment: development
```
- Ensure the database `mini_ecommerce` exists
- Check if PostgreSQL is accepting connections on port 5432

### Step 6: Seed the Database (Optional but Recommended)

Populate the database with sample data including admin/customer users and products:

```bash
npm run seed
```

This creates:
- **Admin user**: `admin@example.com` / `admin123`
- **Customer user**: `customer@example.com` / `customer123`
- **8 sample products** with stock

### Step 7: Start the Application

#### Development Mode (with hot-reload):
```bash
npm run start:dev
```

#### Production Mode:
```bash
npm run build
npm run start:prod
```

The API will be available at: **http://localhost:3000/api/v1**

## Verify Installation

### Test the API Health

Open your browser or use curl:

```bash
curl http://localhost:3000/api/v1/products
```

You should receive a JSON response with an empty array or products if you seeded the database.

### Test Authentication

#### Register a new user:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

You should receive a JWT token in the response.

## Testing with Postman

### Import the Collection

1. Open Postman
2. Click "Import" button
3. Select the `postman_collection.json` file from the project root
4. The collection will be imported with all endpoints

### Configure Environment Variables

1. Create a new environment in Postman
2. Add the following variables:
   - `baseUrl`: `http://localhost:3000/api/v1`
   - `token`: (will be auto-filled after login)
   - `adminToken`: (will be auto-filled after admin login)
   - `productId`: (set manually or from response)
   - `cartItemId`: (set manually or from response)
   - `orderId`: (set manually or from response)

### Test Flow

1. **Login as Customer**:
   - Use: `customer@example.com` / `customer123`
   - Token will be automatically saved

2. **Browse Products**:
   - Get all products
   - Get specific product by ID

3. **Cart Operations**:
   - Add products to cart
   - Update quantities
   - View cart

4. **Place Order**:
   - Create order from cart
   - Process payment

5. **Admin Operations**:
   - Login as Admin: `admin@example.com` / `admin123`
   - Create/Update/Delete products
   - View all orders
   - Update order status

## Database Schema

After running the application for the first time, TypeORM will automatically create all necessary tables:

- `users` - User accounts
- `products` - Product catalog
- `carts` - Shopping carts
- `cart_items` - Cart contents
- `orders` - Order records
- `order_items` - Order line items

You can view these tables using:

```bash
# Using psql
psql -U postgres -d mini_ecommerce
\dt

# Or using pgAdmin 4
```

## Common Issues & Solutions

### Issue 1: Database Connection Failed

**Error**: `Connection terminated unexpectedly` or `ECONNREFUSED`

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL (Linux/macOS)
sudo systemctl start postgresql

# Windows: Use Services app or
pg_ctl start -D "C:\Program Files\PostgreSQL\14\data"
```

### Issue 2: Password Authentication Failed

**Error**: `password authentication failed for user "postgres"`

**Solution**:
- Verify password in `.env` file
- Reset PostgreSQL password:
```bash
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
```

### Issue 3: Database Does Not Exist

**Error**: `database "mini_ecommerce" does not exist`

**Solution**:
```bash
psql -U postgres -c "CREATE DATABASE mini_ecommerce;"
```

### Issue 4: Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
- Change the PORT in `.env` file to another port (e.g., 3001)
- Or kill the process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

### Issue 5: TypeORM Synchronize Issues

**Error**: Tables not created or schema mismatch

**Solution**:
```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE mini_ecommerce;
CREATE DATABASE mini_ecommerce;
\q

# Restart the application
npm run start:dev
```

## Development Workflow

### 1. Making Changes

The application runs in watch mode during development:
```bash
npm run start:dev
```

Any changes to TypeScript files will automatically reload the server.

### 2. Code Formatting

Format your code:
```bash
npm run format
```

### 3. Linting

Check code quality:
```bash
npm run lint
```

### 4. Adding New Features

1. Create entities in `src/entities/`
2. Create DTOs in `src/<module>/dto/`
3. Create services in `src/<module>/<module>.service.ts`
4. Create controllers in `src/<module>/<module>.controller.ts`
5. Create module in `src/<module>/<module>.module.ts`
6. Import module in `src/app.module.ts`

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates optimized JavaScript files in the `dist/` directory.

### Environment Variables for Production

Update `.env` for production:
```env
NODE_ENV=production
DB_HOST=<production-db-host>
DB_PORT=5432
DB_USERNAME=<production-db-user>
DB_PASSWORD=<strong-password>
DB_DATABASE=mini_ecommerce
JWT_SECRET=<strong-random-secret-min-32-chars>
JWT_EXPIRES_IN=7d
PORT=3000
```

**Important for Production**:
- Set `synchronize: false` in `app.module.ts` TypeORM config
- Use migrations instead of auto-sync
- Use environment-specific secrets
- Enable HTTPS
- Set up proper logging
- Configure rate limiting
- Set up monitoring

### Run Production Server

```bash
npm run start:prod
```

Or use a process manager like PM2:
```bash
npm install -g pm2
pm2 start dist/main.js --name mini-ecommerce-api
```

## Next Steps

1. ✅ Complete setup and verify all endpoints work
2. 📝 Read the API documentation in README.md
3. 🧪 Test all endpoints using Postman
4. 🎨 Customize the application for your needs
5. 🚀 Deploy to production

## Support

If you encounter any issues not covered in this guide:

1. Check the error logs in the console
2. Verify all prerequisites are installed correctly
3. Ensure database is running and accessible
4. Review the `.env` configuration
5. Check the README.md for additional information

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Documentation](https://jwt.io/)

---

Happy Coding! 🎉
