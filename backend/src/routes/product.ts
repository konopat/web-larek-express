import {
  Router, Request, Response, NextFunction,
} from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';
import { validateProductBody, validateObjectId, validateProductUpdateBody } from '../middleware/validation';

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
router.post('/', validateProductBody, async (req: Request, res: Response, next: NextFunction) => {
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

// DELETE /product/:productId — удаляет товар
router.delete('/:productId', validateObjectId, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      next(new BadRequestError('Товар не найден'));
      return;
    }

    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    next(new InternalServerError('Ошибка при удалении товара'));
  }
});

// PATCH /product/:productId — обновляет товар
router.patch('/:productId', validateObjectId, validateProductUpdateBody, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      next(new BadRequestError('Товар не найден'));
      return;
    }

    res.json(updatedProduct);
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      next(new ConflictError('Товар с таким названием уже существует'));
      return;
    }

    if (error instanceof MongooseError.ValidationError) {
      next(new BadRequestError('Ошибка валидации данных при обновлении товара'));
      return;
    }

    next(new InternalServerError('Ошибка при обновлении товара'));
  }
});

export default router;
