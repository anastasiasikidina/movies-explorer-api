require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { port, mongoAdress, allowedCors } = require('./utils/constants');
const rateLimiter = require('./middlewares/rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errors');
const router = require('./routes/index');

const app = express();

const { PORT = port, MONGO_ADRESS, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_ADRESS : mongoAdress);

app.use(requestLogger);
app.use(rateLimiter);
app.use(cors({
  option: allowedCors,
  origin: allowedCors,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); /* eslint-disable-line no-console */
});

/* const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { port, mongoAdress, ALLOWED_CORS } = require('./utils/constants');
const routes = require('./routes');
const serverErrorHandler = require('./errors/serverErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = port, MONGO_ADRESS, NODE_ENV } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO_ADRESS : mongoAdress, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(cors({
  origin: ALLOWED_CORS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

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
*/
