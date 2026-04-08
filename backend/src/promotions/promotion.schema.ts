import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true })
export class Promotion {
  // Legacy/basic promotion fields (kept for compatibility)
  @Prop({ trim: true })
  title!: string;

  @Prop({ trim: true })
  description!: string;

  @Prop({ min: 0, max: 100 })
  discountPercentage!: number;

  @Prop()
  imageUrl!: string;

  // Main fields used by the admin & customer UIs
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ required: true, trim: true })
  originalPrice!: string;

  @Prop({ required: true, trim: true })
  salePrice!: string;

  @Prop({ required: true, trim: true })
  discount!: string;

  @Prop({ required: true, trim: true })
  link!: string;

  @Prop({
    required: true,
    enum: ['Active', 'Draft', 'Expired'],
    default: 'Draft',
  })
  status!: 'Active' | 'Draft' | 'Expired';

  @Prop({ type: [String], default: [] })
  imageUrls!: string[];

  @Prop()
  startDate!: Date;

  @Prop()
  endDate!: Date;

  @Prop({ default: true })
  isActive!: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
