import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { createProductValidator, updateProductValidator } from '../validators/product.validator';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/authorize';
import { UserRole } from '@prisma/client';

const router = Router();
const productController = new ProductController();

/**
 * @route   GET /api/products
 * @desc    Get all active products (for customers)
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/admin
 * @desc    Get all products with filters (for admin)
 * @access  Private (Admin only)
 */
router.get(
  '/admin',
  authenticate,
  authorize(UserRole.ADMIN),
  productController.getAllProductsAdmin
);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createProductValidator),
  productController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateProductValidator),
  productController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  productController.deleteProduct
);

export default router;
