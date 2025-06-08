import { Router } from 'express';
import { validateProductBody, validateObjectId, validateProductUpdateBody } from '../middleware/validation';
import {
  getProducts, createProduct, deleteProduct, updateProduct,
} from '../controllers/product';

const router = Router();

// Роуты для продуктов
router.get('/', getProducts);
router.post('/', validateProductBody, createProduct);
router.delete('/:productId', validateObjectId, deleteProduct);
router.patch('/:productId', validateObjectId, validateProductUpdateBody, updateProduct);

export default router;
