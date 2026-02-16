import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { User } from '../../modules/users/entities/user.entity';
import { Product } from '../../modules/products/entities/product.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../shared/constants';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🌱 Starting database seeding...');

    const userRepository = dataSource.getRepository(User);
    const productRepository = dataSource.getRepository(Product);

    // Create Admin User
    console.log('Creating admin user...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      email: 'admin@example.com',
      password: hashedAdminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    });
    await userRepository.save(adminUser);
    console.log('✅ Admin user created: admin@example.com / admin123');

    // Create Customer User
    console.log('Creating customer user...');
    const hashedCustomerPassword = await bcrypt.hash('customer123', 10);
    const customerUser = userRepository.create({
      email: 'customer@example.com',
      password: hashedCustomerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CUSTOMER,
      isActive: true,
    });
    await userRepository.save(customerUser);
    console.log('✅ Customer user created: customer@example.com / customer123');

    // Create Sample Products
    console.log('Creating sample products...');
    const products = [
      {
        name: 'Laptop Pro 15"',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 1299.99,
        stock: 50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Laptop',
        isAvailable: true,
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking',
        price: 29.99,
        stock: 200,
        imageUrl: 'https://via.placeholder.com/300x300?text=Mouse',
        isAvailable: true,
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with Cherry MX switches',
        price: 149.99,
        stock: 75,
        imageUrl: 'https://via.placeholder.com/300x300?text=Keyboard',
        isAvailable: true,
      },
      {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, and card reader',
        price: 49.99,
        stock: 150,
        imageUrl: 'https://via.placeholder.com/300x300?text=USB+Hub',
        isAvailable: true,
      },
      {
        name: 'Webcam HD 1080p',
        description: 'Full HD webcam with built-in microphone',
        price: 79.99,
        stock: 100,
        imageUrl: 'https://via.placeholder.com/300x300?text=Webcam',
        isAvailable: true,
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand',
        price: 39.99,
        stock: 120,
        imageUrl: 'https://via.placeholder.com/300x300?text=Stand',
        isAvailable: true,
      },
      {
        name: 'Headphones Pro',
        description: 'Noise-cancelling wireless headphones',
        price: 299.99,
        stock: 60,
        imageUrl: 'https://via.placeholder.com/300x300?text=Headphones',
        isAvailable: true,
      },
      {
        name: 'Monitor 27" 4K',
        description: '27-inch 4K UHD monitor with HDR support',
        price: 499.99,
        stock: 40,
        imageUrl: 'https://via.placeholder.com/300x300?text=Monitor',
        isAvailable: true,
      },
    ];

    for (const productData of products) {
      const product = productRepository.create(productData);
      await productRepository.save(product);
      console.log(`✅ Product created: ${product.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📝 Login Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Customer: customer@example.com / customer123');
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

seed();
