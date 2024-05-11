import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './product.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
  @Get('discounted')
  findDiscounted() {
    return this.productsService.findDiscounted();
  }


  @Post()
  create(@Body() body: Omit<Product, 'id'>) {
    return this.productsService.create(body);
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadImages(@UploadedFiles() files: any[]) {
    const uploads = await Promise.all(
      (files || []).map((file) =>
        this.cloudinaryService.uploadImage(file, 'addis-majlis/products'),
      ),
    );
    const urls = uploads.map((u) => u.url);
    return { urls };
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
// Commit 4 - 2024-05-01 03:49:00
// Commit 12 - 2024-05-06 19:28:00
// Commit 25 - 2024-05-10 19:38:00
// Commit 2 - 2024-05-01 16:36:00
// Commit 22 - 2024-05-06 18:05:00
// Commit 31 - 2024-05-11 14:07:00
