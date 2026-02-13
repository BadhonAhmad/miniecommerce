import prisma from '../config/database';
import { Product, Prisma } from '@prisma/client';
import { ICreateProductDTO, IUpdateProductDTO } from '../types';

export class ProductRepository {
  async create(data: ICreateProductDTO): Promise<Product> {
    return prisma.product.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
      },
    });
  }

  async findAll(filters?: { category?: string; isActive?: boolean }): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        ...(filters?.category && { category: filters.category }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: IUpdateProductDTO): Promise<Product> {
    const updateData: any = { ...data };
    if (data.price !== undefined) {
      updateData.price = new Prisma.Decimal(data.price);
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }

  async checkStock(id: string, requiredQuantity: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { stock: true },
    });
    return product ? product.stock >= requiredQuantity : false;
  }
}
