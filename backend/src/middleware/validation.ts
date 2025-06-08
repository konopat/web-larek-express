import { celebrate, Joi, Segments } from 'celebrate';

// Валидация ObjectId MongoDB
export const validateObjectId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    productId: Joi.string().hex().length(24).required(),
  }),
});

// Валидация тела запроса для создания продукта
export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).allow(null).optional(),
  }),
});

// Валидация тела запроса для обновления продукта
export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).optional(),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).optional(),
    category: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).allow(null).optional(),
  }),
});

// Валидация тела запроса для создания заказа
export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    address: Joi.string().min(5).max(100).required(),
    total: Joi.number().min(0).required(),
    items: Joi.array().items(
      Joi.string().hex().length(24),
    ).min(1).required(),
  }),
});
