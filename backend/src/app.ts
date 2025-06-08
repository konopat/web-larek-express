import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import errorHandler from './middleware/error-handler';
import NotFoundError from './errors/not-found-error';
import { requestLogger, errorLogger } from './middleware/logger';
import { PORT, DB_ADDRESS } from './config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // теперь клиент имеет доступ только к публичным файлам

// Логирование запросов (должно быть до роутов)
app.use(requestLogger);

// Подключение роутов
app.use('/product', productRoutes);
app.use('/order', orderRoutes);

// Обработка несуществующих маршрутов (404)
app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

// Логирование ошибок (должно быть после роутов, но до обработчиков ошибок)
app.use(errorLogger);

// Обработка ошибок celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use(errorHandler);

// Подключение к MongoDB
mongoose.connect(DB_ADDRESS)
  .then(() => {
    console.log('Успешное подключение к MongoDB');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
