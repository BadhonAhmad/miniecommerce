import { CartRepository } from '../repositories/cart.repository';
import { ProductRepository } from '../repositories/product.repository';
import { IAddToCartDTO, IUpdateCartItemDTO } from '../types';
import { NotFoundError, BadRequestError } from '../utils/errors';

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async getCart(userId: string) {
    const cart = await this.cartRepository.getCartWithItems(userId);
    
    if (!cart) {
      // Create a new cart if it doesn't exist
      return this.cartRepository.findOrCreateCart(userId);
    }

    return cart;
  }

  async addToCart(userId: string, data: IAddToCartDTO) {
    // Check if product exists and is active
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestError('This product is not available');
    }

    // Check if sufficient stock is available
    if (product.stock < data.quantity) {
      throw new BadRequestError(`Insufficient stock. Only ${product.stock} items available`);
    }

    // Get or create cart
    const cart = await this.cartRepository.findOrCreateCart(userId);

    // Add item to cart
    await this.cartRepository.addItem(cart.id, data.productId, data.quantity);

    // Return updated cart
    return this.getCart(userId);
  }

  async updateCartItem(userId: string, productId: string, data: IUpdateCartItemDTO) {
    // Get cart
    const cart = await this.cartRepository.getCartWithItems(userId);
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    // Find cart item
    const cartItem = await this.cartRepository.findCartItem(cart.id, productId);
    if (!cartItem) {
      throw new NotFoundError('Item not found in cart');
    }

    // Check stock availability
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.stock < data.quantity) {
      throw new BadRequestError(`Insufficient stock. Only ${product.stock} items available`);
    }

    // Update quantity
    await this.cartRepository.updateItemQuantity(cartItem.id, data.quantity);

    // Return updated cart
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string) {
    // Get cart
    const cart = await this.cartRepository.getCartWithItems(userId);
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    // Find cart item
    const cartItem = await this.cartRepository.findCartItem(cart.id, productId);
    if (!cartItem) {
      throw new NotFoundError('Item not found in cart');
    }

    // Remove item
    await this.cartRepository.removeItem(cartItem.id);

    // Return updated cart
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepository.getCartWithItems(userId);
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    await this.cartRepository.clearCart(cart.id);
    return { message: 'Cart cleared successfully' };
  }
}
