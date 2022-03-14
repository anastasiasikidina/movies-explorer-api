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

app.use(requestLogger);
app.use(cors({
  origin: ['https://movies.practicum.nomoredomains.work', /\.movies.practicum.nomoredomains.work$/, 'http://movies.practicum.nomoredomains.work/'],
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
