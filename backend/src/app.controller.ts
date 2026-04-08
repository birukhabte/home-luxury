import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return { status: 'ok', service: 'addis-majlis-backend', timestamp: new Date().toISOString() };
  }
}
