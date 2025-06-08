import winston from 'winston';
import expressWinston from 'express-winston';

// логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
  meta: true, // записывать метаданные запроса
  msg: 'HTTP {{req.method}} {{req.url}}', // формат сообщения
  expressFormat: true, // использовать стандартный формат Express
  colorize: false, // отключить цвета в файловых логах
  ignoreRoute() {
    return false; // логировать все запросы
  },
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
  meta: true, // записывать метаданные ошибки
  msg: 'Error in {{req.method}} {{req.url}}: {{err.message}}',
});

export { requestLogger, errorLogger };
