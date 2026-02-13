import prisma from '../config/database';
import { OrderRepository } from '../repositories/order.repository';
import { CartRepository } from '../repositories/cart.repository';
import { UserRepository } from '../repositories/user.repository';
import { ICreateOrderDTO, OrderStatus } from '../types';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { generateOrderNumber, calculateSubtotal } from '../utils/helpers';
import { config } from '../config';

export class OrderService {
  private orderRepository: OrderRepository;
  private cartRepository: CartRepository;
  private userRepository: UserRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.cartRepository = new CartRepository();
    this.userRepository = new UserRepository();
  }

  async createOrder(userId: string, data: ICreateOrderDTO) {
    // Check user status
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Fraud prevention check
    if (user.failedOrders >= config.fraudPrevention.maxFailedOrders) {
      throw new ForbiddenError(
        'Your account has been flagged due to multiple cancelled orders. Please contact support.'
      );
    }

    // Get cart with items
    const cart = await this.cartRepository.getCartWithItems(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cart is empty');
    }

    // Use transaction to ensure data consistency
    return prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItems: any[] = [];

      // Validate stock and calculate totals
      for (const cartItem of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: cartItem.productId },
        });

        if (!product) {
          throw new NotFoundError(`Product ${cartItem.productId} not found`);
        }

        if (!product.isActive) {
          throw new BadRequestError(`Product "${product.name}" is no longer available`);
        }

        // Check stock availability
        if (product.stock < cartItem.quantity) {
          throw new BadRequestError(
            `Insufficient stock for "${product.name}". Only ${product.stock} items available`
          );
        }

        const price = Number(product.price);
        const subtotal = calculateSubtotal(price, cartItem.quantity);
        totalAmount += subtotal;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          price,
          quantity: cartItem.quantity,
          subtotal,
        });

        // Deduct stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: cartItem.quantity,
            },
          },
        });
      }

      // Generate order number
      const orderNumber = generateOrderNumber();

      // Create order using the transaction client
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          totalAmount,
          shippingAddress: data.shippingAddress,
          notes: data.notes,
          items: {
            create: orderItems,
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

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  async getOrders(userId: string) {
    return this.orderRepository.findByUserId(userId);
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Ensure user can only access their own orders
    if (order.userId !== userId) {
      throw new ForbiddenError('You do not have permission to access this order');
    }

    return order;
  }

  async getAllOrders() {
    return this.orderRepository.findAll();
  }

  async getOrderByIdAdmin(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Handle cancelled orders - restore stock and increment failed orders
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      await prisma.$transaction(async (tx) => {
        // Restore stock for each item
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        // Increment failed orders count for fraud prevention
        await tx.user.update({
          where: { id: order.userId },
          data: {
            failedOrders: {
              increment: 1,
            },
          },
        });

        // Update order status
        await tx.order.update({
          where: { id: orderId },
          data: { status },
        });
      });

      return this.orderRepository.findById(orderId);
    }

    return this.orderRepository.updateStatus(orderId, status);
  }

  async simulatePayment(orderId: string, success: boolean = true) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.paymentStatus !== 'PENDING') {
      throw new BadRequestError('Payment has already been processed');
    }

    const newPaymentStatus = success ? 'COMPLETED' : 'FAILED';
    const newOrderStatus = success ? 'PROCESSING' : order.status;

    // Update both payment status and order status if payment succeeds
    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: newPaymentStatus,
          status: newOrderStatus,
        },
      });

      return tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return updatedOrder;
  }
}
