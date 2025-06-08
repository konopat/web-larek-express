import {
  Router, Request, Response, NextFunction,
} from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';

const router = Router();

// Интерфейс для данных заказа
interface OrderData {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Валидация email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /order — создаёт заказ
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      payment,
      email,
      phone,
      address,
      total,
      items,
    }: OrderData = req.body;

    // Проверка обязательных полей
    if (!payment || !email || !phone || !address || total === undefined || !items) {
      next(new BadRequestError('Все поля обязательны: payment, email, phone, address, total, items'));
      return;
    }

    // Валидация payment
    if (payment !== 'card' && payment !== 'online') {
      next(new BadRequestError('Поле payment должно быть "card" или "online"'));
      return;
    }

    // Валидация email
    if (!isValidEmail(email)) {
      next(new BadRequestError('Некорректный формат email'));
      return;
    }

    // Валидация items - непустой массив
    if (!Array.isArray(items) || items.length === 0) {
      next(new BadRequestError('Поле items должно быть непустым массивом'));
      return;
    }

    // Проверка существования товаров в базе данных
    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      next(new BadRequestError('Один или несколько товаров не найдены в базе данных'));
      return;
    }

    // Проверка что все товары продаются (price не null)
    const unsellableProducts = products.filter((product) => product.price === null);
    if (unsellableProducts.length > 0) {
      next(new BadRequestError('Некоторые товары недоступны для продажи'));
      return;
    }

    // Проверка общей суммы заказа
    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
    if (calculatedTotal !== total) {
      next(new BadRequestError(`Неверная общая сумма. Ожидается: ${calculatedTotal}, получено: ${total}`));
      return;
    }

    // Генерация ID заказа
    const orderId = faker.string.uuid();

    // Возврат успешного ответа
    res.status(201).json({
      id: orderId,
      total,
    });
  } catch (error) {
    next(new InternalServerError('Ошибка при создании заказа'));
  }
});

export default router;
