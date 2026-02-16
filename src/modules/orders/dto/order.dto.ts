import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '../../../shared/constants';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class ProcessPaymentDto {
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;
}
