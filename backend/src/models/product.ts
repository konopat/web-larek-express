import mongoose, { Schema, Document } from 'mongoose';

interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct extends Document {
  title: string;
  image: IImage;
  category: string;
  description?: string;
  price?: number | null;
}

// Схема для изображения
const imageSchema = new Schema<IImage>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
}, { _id: false });

// Схема товара
const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
