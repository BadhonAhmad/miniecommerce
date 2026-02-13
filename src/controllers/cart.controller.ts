import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { sendSuccess } from '../utils/response';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const cart = await this.cartService.getCart(userId);
      sendSuccess(res, 200, 'Cart retrieved successfully', cart);
    } catch (error) {
      next(error);
    }
  };

  addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const cart = await this.cartService.addToCart(userId, req.body);
      sendSuccess(res, 200, 'Item added to cart successfully', cart);
    } catch (error) {
      next(error);
    }
  };

  updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { productId } = req.params;
      const cart = await this.cartService.updateCartItem(userId, productId, req.body);
      sendSuccess(res, 200, 'Cart item updated successfully', cart);
    } catch (error) {
      next(error);
    }
  };

  removeFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { productId } = req.params;
      const cart = await this.cartService.removeFromCart(userId, productId);
      sendSuccess(res, 200, 'Item removed from cart successfully', cart);
    } catch (error) {
      next(error);
    }
  };

  clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.cartService.clearCart(userId);
      sendSuccess(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  };
}
