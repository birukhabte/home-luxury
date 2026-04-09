import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument, InquiryStatus } from './inquiry.schema';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectModel(Inquiry.name)
    private readonly inquiryModel: Model<InquiryDocument>,
  ) {}

  async findAll() {
    return this.inquiryModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async create(payload: Omit<Inquiry, 'status' | 'date'>) {
    const inquiry = new this.inquiryModel({
      ...payload,
      date: new Date().toISOString().slice(0, 10),
      status: 'New',
    });
    return inquiry.save();
  }

  async updateStatus(id: string, status: InquiryStatus) {
    const updated = await this.inquiryModel
      .findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
      .exec();
    if (!updated) {
      throw new NotFoundException('Inquiry not found');
    }
    return updated;
  }
}
