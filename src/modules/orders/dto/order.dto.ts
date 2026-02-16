import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../../shared/constants';

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Main St, City, State, ZIP',
    description: 'Shipping address for the order',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'shipped',
    description: 'Order status',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class ProcessPaymentDto {
  @ApiPropertyOptional({
    example: 'credit_card',
    description: 'Payment method used',
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({
    example: '4111111111111111',
    description: 'Transaction ID or card number',
  })
  @IsString()
  @IsOptional()
  transactionId?: string;
}
