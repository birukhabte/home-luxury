import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  findAll(): any {
    return this.inquiriesService.findAll();
  }

  @Post()
  create(@Body() body: any): any {
    return this.inquiriesService.create(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any): any {
    return this.inquiriesService.updateStatus(id, status);
  }
}
