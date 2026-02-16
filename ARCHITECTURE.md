# Project Structure

This document describes the modular architecture of the Mini E-Commerce API.

## Directory Structure

```
src/
│
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
│
├── common/                          # Shared utilities across modules
│   ├── decorators/
│   │   ├── get-user.decorator.ts   # Extract user from request
│   │   └── roles.decorator.ts      # Role-based metadata
│   │
│   ├── filters/
│   │   └── http-exception.filter.ts # Global exception handling
│   │
│   └── guards/
│       ├── jwt-auth.guard.ts       # JWT authentication guard
│       └── roles.guard.ts          # Role-based authorization guard
│
├── config/                          # Configuration files
│   ├── app.config.ts               # Application settings
│   ├── database.config.ts          # Database configuration
│   └── jwt.config.ts               # JWT configuration
│
├── modules/                         # Feature modules
│   │
│   ├── auth/                       # Authentication module
│   │   ├── dto/
│   │   │   └── auth.dto.ts         # Login & Register DTOs
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts     # Passport JWT strategy
│   │   ├── auth.controller.ts      # Auth endpoints
│   │   ├── auth.service.ts         # Auth business logic
│   │   └── auth.module.ts          # Auth module definition
│   │
│   ├── users/                      # Users module
│   │   ├── entities/
│   │   │   └── user.entity.ts      # User database entity
│   │   └── users.module.ts         # Users module definition
│   │
│   ├── products/                   # Products module
│   │   ├── dto/
│   │   │   └── product.dto.ts      # Product DTOs
│   │   ├── entities/
│   │   │   └── product.entity.ts   # Product database entity
│   │   ├── products.controller.ts  # Product endpoints
│   │   ├── products.service.ts     # Product business logic
│   │   └── products.module.ts      # Products module definition
│   │
│   ├── cart/                       # Shopping cart module
│   │   ├── dto/
│   │   │   └── cart.dto.ts         # Cart DTOs
│   │   ├── entities/
│   │   │   ├── cart.entity.ts      # Cart database entity
│   │   │   └── cart-item.entity.ts # Cart item entity
│   │   ├── cart.controller.ts      # Cart endpoints
│   │   ├── cart.service.ts         # Cart business logic
│   │   └── cart.module.ts          # Cart module definition
│   │
│   └── orders/                     # Orders module
│       ├── dto/
│       │   └── order.dto.ts        # Order DTOs
│       ├── entities/
│       │   ├── order.entity.ts     # Order database entity
│       │   └── order-item.entity.ts # Order item entity
│       ├── orders.controller.ts    # Order endpoints
│       ├── orders.service.ts       # Order business logic
│       └── orders.module.ts        # Orders module definition
│
├── database/                        # Database related files
│   ├── migrations/                 # TypeORM migrations (future)
│   └── seeds/
│       └── seed.ts                 # Database seeding script
│
└── shared/                         # Shared constants and utilities
    └── constants.ts                # Application-wide constants

```

## Module Descriptions

### 1. Common Module
Contains shared utilities used across multiple modules:
- **Decorators**: Custom parameter decorators for extracting request data
- **Guards**: Authentication and authorization guards
- **Filters**: Global exception handling

### 2. Config Module
Configuration files separated by concern:
- **app.config.ts**: General application settings
- **database.config.ts**: Database connection configuration
- **jwt.config.ts**: JWT token configuration

### 3. Auth Module
Handles user authentication:
- User registration with password hashing
- User login with JWT token generation
- JWT strategy for token validation
- Profile retrieval

### 4. Users Module
Manages user entities:
- User entity definition
- Exported for use by other modules

### 5. Products Module
Product catalog management:
- CRUD operations for products
- Stock management
- Admin-only access for modifications
- Public read access

### 6. Cart Module
Shopping cart functionality:
- Add/remove items from cart
- Update item quantities
- Stock validation
- Cart persistence per user

### 7. Orders Module
Order processing:
- Create orders from cart
- Payment simulation
- Order status management
- Transaction handling for data consistency
- Fraud prevention

## Architecture Benefits

### Modularity
- Each feature is self-contained in its own module
- Easy to test, maintain, and scale
- Clear separation of concerns

### Scalability
- Modules can be developed independently
- Easy to add new features without affecting existing code
- Can be split into microservices if needed

### Maintainability
- Clear folder structure
- Easy to locate specific functionality
- Consistent patterns across modules

### Reusability
- Common utilities in `common/` folder
- Shared constants in `shared/` folder
- Configuration centralized in `config/`

## Import Paths

With this structure, imports follow clear patterns:

```typescript
// Cross-module entities
import { User } from '../users/entities/user.entity';

// Common utilities
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

// Shared constants
import { UserRole, OrderStatus } from '../../shared/constants';

// Configuration
import { getDatabaseConfig } from '../../config/database.config';

// Within same module
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';
```

## Module Dependencies

```
AppModule
  ├── ConfigModule (Global)
  ├── TypeOrmModule (Global)
  ├── AuthModule
  │   └── UsersModule
  ├── UsersModule
  ├── ProductsModule
  ├── CartModule
  │   └── ProductsModule
  └── OrdersModule
      ├── CartModule
      ├── ProductsModule
      └── UsersModule
```

## Entity Relationships

```
User
  ├── 1:Many → Orders
  └── 1:1 → Cart

Product
  ├── 1:Many → OrderItems
  └── 1:Many → CartItems

Cart
  ├── Many:1 → User
  └── 1:Many → CartItems

CartItem
  ├── Many:1 → Cart
  └── Many:1 → Product

Order
  ├── Many:1 → User
  └── 1:Many → OrderItems

OrderItem
  ├── Many:1 → Order
  └── Many:1 → Product
```

## Best Practices Implemented

1. **Separation of Concerns**: Each module handles one feature
2. **SOLID Principles**: Single responsibility, dependency injection
3. **DRY (Don't Repeat Yourself)**: Shared utilities and constants
4. **Clean Architecture**: Layers of abstraction (controller → service → repository)
5. **Type Safety**: TypeScript throughout
6. **Validation**: DTOs with class-validator
7. **Security**: Guards for authentication and authorization
8. **Error Handling**: Global exception filter
9. **Configuration Management**: Environment-based configuration

## Development Workflow

### Adding a New Feature

1. Create new module folder in `src/modules/`
2. Create entities in `entities/` subfolder
3. Create DTOs in `dto/` subfolder
4. Create service with business logic
5. Create controller with endpoints
6. Create module file
7. Import in `app.module.ts`

### Adding New Entity

1. Create entity file in appropriate module's `entities/` folder
2. Add relationships to other entities
3. Import in module's TypeORM configuration
4. TypeORM will auto-sync (or create migration in production)

### Adding New Endpoint

1. Add method to appropriate controller
2. Implement business logic in service
3. Create/update DTOs for request/response
4. Add guards for authentication/authorization
5. Document in API documentation

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Seed database
npm run seed
```

## Future Enhancements

1. Add unit tests for each module
2. Create migrations in `database/migrations/`
3. Add API versioning in modules
4. Implement caching with Redis
5. Add rate limiting
6. Implement refresh tokens
7. Add file upload module
8. Create admin dashboard module

---

This structure provides a solid foundation for building scalable, maintainable, and production-ready applications.
