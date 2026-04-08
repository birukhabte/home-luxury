import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;
export type PaymentMethod = 'chapa' | 'bank';

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerName!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true })
  productName!: string;

  @Prop()
  productId?: string;

  @Prop({ required: true })
  quantity!: number;

  @Prop({ required: true })
  totalAmount!: number;

  @Prop()
  notes?: string;

  @Prop({ required: true, enum: ['chapa', 'bank'] })
  paymentMethod!: PaymentMethod;

  @Prop({ required: true })
  createdAt!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
