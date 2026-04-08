import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';
import { UsersService } from './users/users.service';
import { PromotionsService } from './promotions/promotions.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const productsService = appContext.get(ProductsService);
  const usersService = appContext.get(UsersService);
  const promotionsService = appContext.get(PromotionsService);

  // Seed products
  if ((await productsService.findAll()).length === 0) {
    await productsService.create({
      name: 'The Sovereign',
      category: 'Luxury Sofas',
      price: '95000',
      material: 'Premium leather and gold-accented wood',
      status: 'Active',
    } as any);

    await productsService.create({
      name: 'Arabian Majlis Set',
      category: 'Arabian Majlis',
      price: '120000',
      material: 'Handcrafted fabrics and carved wood',
      status: 'Active',
    } as any);
  }

  // Seed an admin user (very basic, for demo only)
  const existingAdmin = await usersService.findByEmail('admin@addismajlis.com');
  if (!existingAdmin) {
    await usersService.create({
      email: 'admin@addismajlis.com',
      passwordHash: 'admin123', // In real apps, use bcrypt hashing
      name: 'Admin User',
      role: 'admin',
    });
  }

  // Seed a sample promotion
  if ((await promotionsService.findAll()).length === 0) {
    await promotionsService.create({
      // Basic/legacy fields
      title: 'Grand Opening Offer',
      description:
        'Exclusive launch discounts on luxury sofas and Arabian Majlis sets.',
      discountPercentage: 15,
      isActive: true,
      // Fields used by the admin & customer UIs
      name: 'Grand Opening Offer',
      category: 'Luxury Sofas',
      originalPrice: 'ETB 200,000',
      salePrice: 'ETB 170,000',
      discount: '15%',
      link: '/luxury-sofas',
      status: 'Active',
      imageUrls: [],
    });
  }

  await appContext.close();
}

bootstrap()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database seed completed');
    process.exit(0);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Database seed failed', err);
    process.exit(1);
  });
