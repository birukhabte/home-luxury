import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): any {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() body: any): any {
    return this.ordersService.create(body);
  }
}
// Commit 18 - 2024-05-07 19:51:00
// Commit 20 - 2024-05-09 02:38:00
// Commit 41 - 2024-05-21 22:18:00
