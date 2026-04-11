import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export type Category = 'Luxury Sofas' | 'Arabian Majlis' | 'Luxury TV Stands';
export type ProductStatus = 'Active' | 'Draft' | 'Out of Stock';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  category!: Category;

  @Prop({ required: true })
  price!: string;

  @Prop()
  originalPrice?: string;

  @Prop()
  discountPrice?: string;

  @Prop({ required: true })
  material!: string;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  imageColor?: string;

  @Prop({ type: [String], default: [] })
  imageUrls!: string[];

  @Prop({ type: [String], default: [] })
  imageColors!: string[];

  @Prop({ required: true, enum: ['Active', 'Draft', 'Out of Stock'] })
  status!: ProductStatus;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
