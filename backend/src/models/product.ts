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
    required: [true, 'Поле "fileName" должно быть заполнено'],
    minlength: [1, 'Поле "fileName" не может быть пустым'],
  },
  originalName: {
    type: String,
    required: [true, 'Поле "originalName" должно быть заполнено'],
    minlength: [1, 'Поле "originalName" не может быть пустым'],
  },
}, { _id: false });

// Схема товара
const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
  },
  image: {
    type: imageSchema,
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "category" - 2'],
    maxlength: [50, 'Максимальная длина поля "category" - 50'],
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Максимальная длина поля "description" - 500'],
  },
  price: {
    type: Number,
    required: false,
    default: null,
    min: [0, 'Цена не может быть отрицательной'],
  },
});

export default mongoose.model<IProduct>('product', productSchema);
