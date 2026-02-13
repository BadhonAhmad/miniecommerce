import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess } from '../utils/response';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      sendSuccess(res, 201, 'Product created successfully', product);
    } catch (error) {
      next(error);
    }
  };

  getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category } = req.query;
      const products = await this.productService.getAllProducts(category as string);
      sendSuccess(res, 200, 'Products retrieved successfully', products);
    } catch (error) {
      next(error);
    }
  };

  getAllProductsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category, isActive } = req.query;
      const products = await this.productService.getAllProductsAdmin(
        category as string,
        isActive === 'true' ? true : isActive === 'false' ? false : undefined
      );
      sendSuccess(res, 200, 'Products retrieved successfully', products);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      sendSuccess(res, 200, 'Product retrieved successfully', product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(id, req.body);
      sendSuccess(res, 200, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);
      sendSuccess(res, 200, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
