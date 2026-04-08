import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() body: Omit<Product, 'id'>) {
    return this.productsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Omit<Product, 'id'>) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
