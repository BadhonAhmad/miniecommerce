import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { createOrderValidator } from '../validators/order.validator';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/authorize';
import { body } from 'express-validator';

const router = Router();
const orderController = new OrderController();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private (Customer only)
 */
router.post(
  '/',
  authenticate,
  authorize('CUSTOMER'),
  validate(createOrderValidator),
  orderController.createOrder
);

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private (Customer only)
 */
router.get(
  '/',
  authenticate,
  authorize('CUSTOMER'),
  orderController.getOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private (Customer only)
 */
router.get(
  '/:id',
  authenticate,
  authorize('CUSTOMER'),
  orderController.getOrderById
);

// Admin routes
/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders
 * @access  Private (Admin only)
 */
router.get(
  '/admin/all',
  authenticate,
  authorize('ADMIN'),
  orderController.getAllOrders
);

/**
 * @route   GET /api/orders/admin/:id
 * @desc    Get order by ID (admin)
 * @access  Private (Admin only)
 */
router.get(
  '/admin/:id',
  authenticate,
  authorize('ADMIN'),
  orderController.getOrderByIdAdmin
);

/**
 * @route   PATCH /api/orders/admin/:id/status
 * @desc    Update order status
 * @access  Private (Admin only)
 */
router.patch(
  '/admin/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate([
    body('status')
      .isIn(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
      .withMessage('Invalid order status'),
  ]),
  orderController.updateOrderStatus
);

/**
 * @route   POST /api/orders/admin/:id/payment
 * @desc    Simulate payment for an order
 * @access  Private (Admin only)
 */
router.post(
  '/admin/:id/payment',
  authenticate,
  authorize('ADMIN'),
  validate([
    body('success')
      .isBoolean()
      .withMessage('success must be a boolean value'),
  ]),
  orderController.simulatePayment
);

export default router;

