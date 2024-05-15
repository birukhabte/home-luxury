import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async findAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).lean().exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(payload: Omit<Order, 'createdAt'>) {
    const createdAt = new Date().toISOString();
    const created = new this.orderModel({ ...payload, createdAt });
    return created.save();
  }
}
// Commit 13 - 2024-05-06 23:48:00
// Commit 65 - 2024-05-30 16:16:00
// Commit 19 - 2024-05-06 22:08:00
// Commit 20 - 2024-05-06 10:10:00
// Commit 40 - 2024-05-14 08:12:00
// Commit 42 - 2024-05-16 01:46:00
