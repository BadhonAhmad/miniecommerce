import prisma from '../config/database';
import { Cart, CartItem } from '@prisma/client';

export class CartRepository {
  async findOrCreateCart(userId: string): Promise<Cart> {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async getCartWithItems(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addItem(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    // Check if item already exists
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
        include: {
          product: true,
        },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: true,
      },
    });
  }

  async removeItem(cartItemId: string): Promise<void> {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async findCartItem(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });
  }

  async getCartItems(cartId: string) {
    return prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: true,
      },
    });
  }
}
