import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Addis Majlis Glory API',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        products: '/products',
        orders: '/orders',
        promotions: '/promotions',
        inquiries: '/inquiries',
        users: '/users',
        chapa: '/chapa',
      },
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'addis-majlis-backend', timestamp: new Date().toISOString() };
  }
}
