import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InquiryDocument = Inquiry & Document;
export type InquiryStatus = 'New' | 'In Progress' | 'Responded' | 'Closed';

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  product!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true, enum: ['New', 'In Progress', 'Responded', 'Closed'], default: 'New' })
  status!: InquiryStatus;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
