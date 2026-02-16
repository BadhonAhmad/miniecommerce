import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto, UpdateStockDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isAvailable: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: number, updateStockDto: UpdateStockDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateStockDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    product.stock = updateStockDto.stock;
    return await this.productRepository.save(product);
  }

  async checkStockAvailability(productId: number, quantity: number): Promise<boolean> {
    const product = await this.findOne(productId);
    return product.stock >= quantity && product.isAvailable;
  }

  async decrementStock(productId: number, quantity: number): Promise<void> {
    const product = await this.findOne(productId);

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    product.stock -= quantity;
    await this.productRepository.save(product);
  }

  async incrementStock(productId: number, quantity: number): Promise<void> {
    const product = await this.findOne(productId);
    product.stock += quantity;
    await this.productRepository.save(product);
  }
}
