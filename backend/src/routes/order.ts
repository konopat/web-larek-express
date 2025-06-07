import { Router, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';

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
router.post('/', async (req: Request, res: Response) => {
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
      res.status(400).json({
        message: 'Все поля обязательны: payment, email, phone, address, total, items',
      });
      return;
    }

    // Валидация payment
    if (payment !== 'card' && payment !== 'online') {
      res.status(400).json({
        message: 'Поле payment должно быть "card" или "online"',
      });
      return;
    }

    // Валидация email
    if (!isValidEmail(email)) {
      res.status(400).json({
        message: 'Некорректный формат email',
      });
      return;
    }

    // Валидация items - непустой массив
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        message: 'Поле items должно быть непустым массивом',
      });
      return;
    }

    // Проверка существования товаров в базе данных
    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      res.status(400).json({
        message: 'Один или несколько товаров не найдены в базе данных',
      });
      return;
    }

    // Проверка что все товары продаются (price не null)
    const unsellableProducts = products.filter((product) => product.price === null);
    if (unsellableProducts.length > 0) {
      res.status(400).json({
        message: 'Некоторые товары недоступны для продажи',
      });
      return;
    }

    // Проверка общей суммы заказа
    const calculatedTotal = products.reduce((sum, product) => sum + (product.price || 0), 0);
    if (calculatedTotal !== total) {
      res.status(400).json({
        message: `Неверная общая сумма. Ожидается: ${calculatedTotal}, получено: ${total}`,
      });
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
    res.status(500).json({ message: 'Ошибка при создании заказа', error });
  }
});

export default router;
