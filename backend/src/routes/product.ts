import {
  Router, Request, Response, NextFunction,
} from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';

const router = Router();

// GET /product — возвращает все товары
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    next(new InternalServerError('Ошибка при получении товаров'));
  }
});

// POST /product — создаёт товар
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      next(new ConflictError('Товар с таким названием уже существует'));
      return;
    }

    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Ошибка валидации данных при создании товара'));
      return;
    }

    next(new InternalServerError('Ошибка при создании товара'));
  }
});

export default router;
