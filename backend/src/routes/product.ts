import { Router, Request, Response } from 'express';
import Product from '../models/product';

const router = Router();

// GET /product — возвращает все товары
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении товаров', error });
  }
});

// POST /product — создаёт товар
router.post('/', async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании товара', error });
  }
});

export default router;
