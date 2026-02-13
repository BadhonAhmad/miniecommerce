import prisma from '../config/database';
import { Order, OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

interface CreateOrderData {
  userId: string;
  orderNumber: string;
  totalAmount: number;
  shippingAddress: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
}

export class OrderRepository {
  async create(data: CreateOrderData): Promise<Order> {
    return prisma.order.create({
      data: {
        userId: data.userId,
        orderNumber: data.orderNumber,
        totalAmount: new Prisma.Decimal(data.totalAmount),
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: new Prisma.Decimal(item.price),
            quantity: item.quantity,
            subtotal: new Prisma.Decimal(item.subtotal),
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<Order[]> {
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        items: true,
      },
    });
  }
}
