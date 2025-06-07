import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import productRoutes from './routes/product';

dotenv.config();

const { PORT } = process.env;
const app = express();
app.use(cors());
app.use(express.json());

// Подключение роутов
app.use('/product', productRoutes);

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/weblarek')
  .then(() => {
    console.log('Успешное подключение к MongoDB');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
