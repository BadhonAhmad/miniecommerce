import { ProductRepository } from '../repositories/product.repository';
import { ICreateProductDTO, IUpdateProductDTO } from '../types';
import { NotFoundError, BadRequestError } from '../utils/errors';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(data: ICreateProductDTO) {
    if (data.stock < 0) {
      throw new BadRequestError('Stock cannot be negative');
    }

    return this.productRepository.create(data);
  }

  async getAllProducts(category?: string) {
    return this.productRepository.findAll({
      ...(category && { category }),
      isActive: true,
    });
  }

  async getAllProductsAdmin(category?: string, isActive?: boolean) {
    return this.productRepository.findAll({
      ...(category && { category }),
      ...(isActive !== undefined && { isActive }),
    });
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  async updateProduct(id: string, data: IUpdateProductDTO) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new BadRequestError('Stock cannot be negative');
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return this.productRepository.delete(id);
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new BadRequestError('Stock cannot be negative');
    }

    return this.productRepository.updateStock(id, quantity);
  }
}
