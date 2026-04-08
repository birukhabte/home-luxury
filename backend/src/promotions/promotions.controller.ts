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
import { PromotionsService } from './promotions.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('promotions')
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async findAll(): Promise<any[]> {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    return this.promotionsService.findById(id);
  }

  @Post()
  async create(
    @Body()
    body: any,
  ): Promise<any> {
    return this.promotionsService.create(body);
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files', 3))
  async uploadImages(@UploadedFiles() files: any[]): Promise<{ urls: string[] }> {
    const uploads = await Promise.all(
      (files || []).map((file) =>
        this.cloudinaryService.uploadImage(file, 'addis-majlis/promotions'),
      ),
    );
    const urls = uploads.map((u) => u.url);
    return { urls };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: any,
  ): Promise<any> {
    return this.promotionsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.promotionsService.delete(id);
  }
}
