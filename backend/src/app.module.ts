import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ChapaModule } from './chapa/chapa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://localhost:27017/addis-majlis-glory',
    ),
    ProductsModule,
    InquiriesModule,
    OrdersModule,
    UsersModule,
    PromotionsModule,
    CloudinaryModule,
    ChapaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
