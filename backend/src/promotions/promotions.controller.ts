import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

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
    body: {
      title: string;
      description?: string;
      discountPercentage: number;
      imageUrl?: string;
      startDate?: Date;
      endDate?: Date;
      isActive?: boolean;
    },
  ): Promise<any> {
    return this.promotionsService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      description: string;
      discountPercentage: number;
      imageUrl: string;
      startDate: Date;
      endDate: Date;
      isActive: boolean;
    }>,
  ): Promise<any> {
    return this.promotionsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.promotionsService.delete(id);
  }
}
