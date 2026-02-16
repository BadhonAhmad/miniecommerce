import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, ProcessPaymentDto } from './dto/order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../shared/constants';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@GetUser() user: User, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(user, createOrderDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.ordersService.findAllOrders();
    }
    return this.ordersService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.ordersService.findOne(id, user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  cancelOrder(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.ordersService.cancelOrder(id, user.id);
  }

  @Post(':id/payment')
  processPayment(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    return this.ordersService.processPayment(id, user.id, processPaymentDto);
  }
}
