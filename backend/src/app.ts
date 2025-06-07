import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
