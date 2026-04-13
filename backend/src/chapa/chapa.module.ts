import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChapaController } from './chapa.controller';
import { ChapaService } from './chapa.service';

@Module({
  imports: [ConfigModule],
  controllers: [ChapaController],
  providers: [ChapaService],
  exports: [ChapaService],
})
export class ChapaModule {}
