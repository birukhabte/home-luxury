import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true })
  description!: string;

  @Prop({ required: true, min: 0, max: 100 })
  discountPercentage!: number;

  @Prop()
  imageUrl!: string;

  @Prop()
  startDate!: Date;

  @Prop()
  endDate!: Date;

  @Prop({ default: true })
  isActive!: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
