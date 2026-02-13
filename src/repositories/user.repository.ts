import prisma from '../config/database';
import { IRegisterDTO } from '../types';
import { User, UserRole } from '../types';

export class UserRepository {
  async create(data: IRegisterDTO & { role?: UserRole }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async incrementFailedOrders(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedOrders: {
          increment: 1,
        },
      },
    });
  }

  async updateActive(userId: string, isActive: boolean): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }
}
