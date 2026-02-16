import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop Pro 15"',
    description: 'Product name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'High-performance laptop with 16GB RAM and 512GB SSD',
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1299.99,
    description: 'Product price',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 50,
    description: 'Product stock quantity',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    example: 'https://via.placeholder.com/300x300?text=Laptop',
    description: 'Product image URL',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Laptop Pro 15"',
    description: 'Product name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'High-performance laptop',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 1199.99,
    description: 'Product price',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Product stock quantity',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    example: 'https://via.placeholder.com/300x300?text=Laptop',
    description: 'Product image URL',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Product availability status',
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class UpdateStockDto {
  @ApiProperty({
    example: 100,
    description: 'New stock quantity',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;
}
