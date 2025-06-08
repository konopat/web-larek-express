import {
  Router, Request, Response, NextFunction,
} from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';
import { validateOrderBody } from '../middleware/validation';

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

// Валидация email теперь выполняется в middleware celebrate

// POST /order — создаёт заказ
router.post('/', validateOrderBody, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      total,
      items,
    }: OrderData = req.body;

    // Базовая валидация уже выполнена middleware celebrate
    // Дополнительная бизнес-логика валидации

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
