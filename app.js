const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { port, mongoAdress, ALLOWED_CORS } = require('./utils/constants');
const routes = require('./routes');
const auth = require('./middlewares/auth');
const serverErrorHandler = require('./errors/serverErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const cors = require('./middlewares/cors');

const { PORT = port, MONGO_ADRESS, NODE_ENV } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO_ADRESS : mongoAdress, {
  useNewUrlParser: true,
});

app.use(requestLogger);
/*
app.use(cors);
*/
app.use(cors({
  origin: ALLOWED_CORS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
}));

app.use(auth);

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
