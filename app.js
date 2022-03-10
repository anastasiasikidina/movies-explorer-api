const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { port, mongoAdress } = require('./utils/constants');
const routes = require('./routes');
const serverErrorHandler = require('./errors/serverErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = port, MONGO_ADRESS, NODE_ENV } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO_ADRESS : mongoAdress, {
  useNewUrlParser: true,
});
// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', '*');
  }

  next();

  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }
  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
});

app.use(requestLogger);
app.use(
  cors({
    option: allowedCors,
    origin: allowedCors,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.static(__dirname));

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(serverErrorHandler);

app.listen(PORT, () => {
  console.log(`App has been started on port: ${PORT}`);
});
