import { Router } from 'express';
import { validateOrderBody } from '../middleware/validation';
import createOrder from '../controllers/order';

const router = Router();

// Роуты для заказов
router.post('/', validateOrderBody, createOrder);

export default router;
