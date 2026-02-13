import { UserRole } from '@prisma/client';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  failedOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface IRegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: string;
  isActive: boolean;
}

export interface ICreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: string;
}

export interface IUpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  category?: string;
  isActive?: boolean;
}

export interface ICartItem {
  id: string;
  productId: string;
  quantity: number;
  product: IProduct;
}

export interface IAddToCartDTO {
  productId: string;
  quantity: number;
}

export interface IUpdateCartItemDTO {
  quantity: number;
}

export interface ICreateOrderDTO {
  shippingAddress: string;
  notes?: string;
}
