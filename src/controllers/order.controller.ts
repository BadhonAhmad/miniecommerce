import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { sendSuccess } from '../utils/response';
import { OrderStatus } from '../types';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const order = await this.orderService.createOrder(userId, req.body);
      sendSuccess(res, 201, 'Order placed successfully', order);
    } catch (error) {
      next(error);
    }
  };

  getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const orders = await this.orderService.getOrders(userId);
      sendSuccess(res, 200, 'Orders retrieved successfully', orders);
    } catch (error) {
      next(error);
    }
  };

  getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const order = await this.orderService.getOrderById(userId, id);
      sendSuccess(res, 200, 'Order retrieved successfully', order);
    } catch (error) {
      next(error);
    }
  };

  // Admin routes
  getAllOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getAllOrders();
      sendSuccess(res, 200, 'All orders retrieved successfully', orders);
    } catch (error) {
      next(error);
    }
  };

  getOrderByIdAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderByIdAdmin(id);
      sendSuccess(res, 200, 'Order retrieved successfully', order);
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(id, status as OrderStatus);
      sendSuccess(res, 200, 'Order status updated successfully', order);
    } catch (error) {
      next(error);
    }
  };

  simulatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { success } = req.body;
      const order = await this.orderService.simulatePayment(id, success);
      sendSuccess(
        res,
        200,
        success ? 'Payment completed successfully' : 'Payment failed',
        order
      );
    } catch (error) {
      next(error);
    }
  };
}
