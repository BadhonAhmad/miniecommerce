import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { addToCartValidator, updateCartItemValidator } from '../validators/cart.validator';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/authorize';
import { UserRole } from '@prisma/client';

const router = Router();
const cartController = new CartController();

// All cart routes require authentication and customer role
router.use(authenticate, authorize(UserRole.CUSTOMER));

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private (Customer only)
 */
router.get('/', cartController.getCart);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private (Customer only)
 */
router.post('/', validate(addToCartValidator), cartController.addToCart);

/**
 * @route   PUT /api/cart/:productId
 * @desc    Update cart item quantity
 * @access  Private (Customer only)
 */
router.put('/:productId', validate(updateCartItemValidator), cartController.updateCartItem);

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove item from cart
 * @access  Private (Customer only)
 */
router.delete('/:productId', cartController.removeFromCart);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private (Customer only)
 */
router.delete('/', cartController.clearCart);

export default router;
