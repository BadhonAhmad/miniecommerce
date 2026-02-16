import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    example: 1,
    description: 'Product ID to add to cart',
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity to add',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({
    example: 3,
    description: 'New quantity for cart item',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
