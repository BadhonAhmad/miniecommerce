import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getInfo() {
    return {
      message: 'Mini E-Commerce API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        auth: '/api/v1/auth',
        products: '/api/v1/products',
        cart: '/api/v1/cart',
        orders: '/api/v1/orders',
      },
      documentation: {
        readme: 'See README.md',
        apiDocs: 'See API_DOCUMENTATION.md',
        postman: 'Import postman_collection.json',
      },
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
