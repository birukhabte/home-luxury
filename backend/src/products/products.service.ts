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

  async create(payload: Omit<Product, 'id'>) {
    const created = new this.productModel(payload);
    return created.save();
  }

  async update(id: string, payload: Omit<Product, 'id'>) {
    const updated = await this.productModel
      .findByIdAndUpdate(id, payload, { new: true })
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
