import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create sample customer
  const customerPassword = await bcrypt.hash('Customer@123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
    },
  });

  console.log('Sample customer created:', customer.email);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        stock: 50,
        category: 'Electronics',
        imageUrl: 'https://example.com/headphones.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smart Watch Series 5',
        description: 'Fitness tracking smartwatch with heart rate monitor',
        price: 299.99,
        stock: 30,
        category: 'Electronics',
        imageUrl: 'https://example.com/smartwatch.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Laptop Stand Aluminum',
        description: 'Ergonomic aluminum laptop stand for better posture',
        price: 49.99,
        stock: 100,
        category: 'Accessories',
        imageUrl: 'https://example.com/laptop-stand.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'USB-C Hub 7-in-1',
        description: 'Multi-port USB-C hub with HDMI, SD card reader, and USB ports',
        price: 39.99,
        stock: 75,
        category: 'Accessories',
        imageUrl: 'https://example.com/usb-hub.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mechanical Keyboard RGB',
        description: 'Gaming mechanical keyboard with customizable RGB lighting',
        price: 129.99,
        stock: 45,
        category: 'Electronics',
        imageUrl: 'https://example.com/keyboard.jpg',
      },
    }),
  ]);

  console.log(`Created ${products.length} sample products`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
