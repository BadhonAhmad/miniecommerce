import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto, UpdateOrderStatusDto, ProcessPaymentDto } from './dto/order.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { OrderStatus, PaymentStatus } from '../../shared/constants';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cartService: CartService,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async createOrder(user: User, createOrderDto: CreateOrderDto): Promise<Order> {
    await this.checkFraudRisk(user);

    const cart = await this.cartService.getCart(user.id);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of cart.items) {
        const product = await this.productsService.findOne(cartItem.product.id);

        if (product.stock < cartItem.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`,
          );
        }

        if (!product.isAvailable) {
          throw new BadRequestException(`Product ${product.name} is not available`);
        }

        const subtotal = Number(product.price) * cartItem.quantity;
        totalAmount += subtotal;

        const orderItem = this.orderItemRepository.create({
          product,
          quantity: cartItem.quantity,
          price: product.price,
          subtotal,
        });

        orderItems.push(orderItem);

        await queryRunner.manager.decrement(
          'products',
          { id: product.id },
          'stock',
          cartItem.quantity,
        );
      }

      const order = this.orderRepository.create({
        user,
        items: orderItems,
        totalAmount,
        shippingAddress: createOrderDto.shippingAddress,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      });

      await queryRunner.manager.save(order);

      await queryRunner.manager.remove(cart.items);

      await queryRunner.commitTransaction();

      return await this.findOne(order.id, user.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderStatusDto.status;
    await this.orderRepository.save(order);

    return order;
  }

  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    const order = await this.findOne(orderId, userId);

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel order that has been shipped or delivered');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of order.items) {
        await queryRunner.manager.increment(
          'products',
          { id: item.product.id },
          'stock',
          item.quantity,
        );
      }

      order.status = OrderStatus.CANCELLED;
      await queryRunner.manager.save(order);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      user.cancelledOrdersCount += 1;
      user.lastCancellationDate = new Date();
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async processPayment(orderId: number, userId: number, processPaymentDto: ProcessPaymentDto): Promise<Order> {
    const order = await this.findOne(orderId, userId);

    if (order.paymentStatus === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment already completed');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot process payment for cancelled order');
    }

    const paymentSuccess = Math.random() > 0.1;

    if (paymentSuccess) {
      order.paymentStatus = PaymentStatus.COMPLETED;
      order.status = OrderStatus.PAID;
    } else {
      order.paymentStatus = PaymentStatus.FAILED;
      throw new BadRequestException('Payment processing failed. Please try again.');
    }

    await this.orderRepository.save(order);

    return order;
  }

  private async checkFraudRisk(user: User): Promise<void> {
    const fullUser = await this.userRepository.findOne({ where: { id: user.id } });

    if (fullUser.cancelledOrdersCount >= 5) {
      const daysSinceLastCancellation = fullUser.lastCancellationDate
        ? Math.floor((Date.now() - fullUser.lastCancellationDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      if (daysSinceLastCancellation !== null && daysSinceLastCancellation < 30) {
        throw new ForbiddenException(
          'Your account has been flagged for suspicious activity. Please contact support.',
        );
      }
    }
  }
}
