const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const routes = require('./routes');
const serverErrorHandler = require('./middlewares/serverErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const port = 3000;
const mongoAdress = 'mongodb://localhost:27017/bitfilmsdb';

const { PORT = port, MONGO_URL = mongoAdress, NODE_ENV } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : mongoAdress, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.use(cors({
  origin:  ['https://movies-explorer-api.nomoredomains.rocks', /\.movies-explorer-api.nomoredomains.rocks$/, 'http://movies-explorer-api.nomoredomains.rocks/'],
  credentials: true,
}));
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.static(__dirname));

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(serverErrorHandler);

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
