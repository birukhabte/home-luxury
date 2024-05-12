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
// Commit 34 - 2024-05-17 12:02:00
// Commit 55 - 2024-05-26 11:45:00
// Commit 60 - 2024-05-29 10:19:00
// Commit 30 - 2024-05-10 01:39:00
// Commit 35 - 2024-05-12 03:12:00
// Commit 37 - 2024-05-12 15:15:00
