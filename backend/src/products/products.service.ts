import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll() {
    return this.productModel.find().sort({ createdAt: -1 }).lean().exec();
  }
  async findDiscounted() {
    return this.productModel
      .find({
        status: 'Active',
        originalPrice: { $exists: true, $ne: null, $nin: ['', null] },
        discountPrice: { $exists: true, $ne: null, $nin: ['', null] }
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async create(payload: Omit<Product, 'id'>) {
    const created = new this.productModel(payload);
    return created.save();
  }

  async update(id: string, payload: Omit<Product, 'id'>) {
    const updated = await this.productModel
      .findByIdAndUpdate(id, payload, { returnDocument: 'after' })
      .exec();
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Product not found');
    }
    return deleted;
  }
}
// Commit 14 - 2024-05-07 23:26:00
// Commit 21 - 2024-05-09 04:09:00
// Commit 26 - 2024-05-10 04:41:00
// Commit 5 - 2024-05-01 14:07:00
