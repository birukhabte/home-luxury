import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from './promotion.schema';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<PromotionDocument>,
  ) {}

  async findAll(): Promise<any[]> {
    return this.promotionModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findById(id: string): Promise<any> {
    const promo = await this.promotionModel.findById(id).lean().exec();
    if (!promo) {
      throw new NotFoundException('Promotion not found');
    }
    return promo;
  }

  // Accept a flexible payload so both legacy and new shapes work
  async create(payload: any): Promise<any> {
    const created = new this.promotionModel(payload);
    return created.save();
  }

  async update(id: string, payload: any): Promise<any> {
    const updated = await this.promotionModel
      .findByIdAndUpdate(id, payload, { returnDocument: 'after' })
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Promotion not found');
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const res = await this.promotionModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('Promotion not found');
    }
  }
}
